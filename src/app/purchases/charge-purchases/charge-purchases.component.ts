import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { lastValueFrom, Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PaymentModel } from '../../payments/payment.model'
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component'
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component'
import { ProviderModel } from '../../providers/provider.model'
import { CreatePurchaseItemModel } from '../create-purchase-item.model'
import { CreatePurchaseModel } from '../create-purchase.model'
import { PurchasesService } from '../purchases.service'
import { PurchaseOrdersService } from '../../purchase-orders/purchase-orders.service'
import { ProductsService } from '../../products/products.service'
import { IgvCode } from '../../sales/igv-code.enum'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component'
import { InvoiceCode } from '../../sales/invoice-code.enum'

interface FormData {
    invoiceCode: string
    createdAt: Date
    expirationAt: Date | null
    serie: string
    observation: string
}

@Component({
    selector: 'app-charge-purchases',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './charge-purchases.component.html',
    styleUrls: ['./charge-purchases.component.sass']
})
export class ChargePurchasesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly productsService = inject(ProductsService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '00',
        createdAt: new Date(),
        expirationAt: null,
        serie: '',
        observation: '',
    } as FormData)
    purchaseItems: CreatePurchaseItemModel[] = []
    $charge = signal<number>(0)
    $provider = signal<ProviderModel | null>(null)
    $isLoading = signal<boolean>(false)
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comprar')

        this.navigationService.setMenu([
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider':
                    const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(provider => {
                        if (provider) {
                            this.$provider.set(provider)
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.$provider.set(provider)
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })

        this.handlePurchaseItems$ = this.purchasesService.handlePurchaseItems().subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.$charge.set(0)
            let charge = 0

            for (const purchaseItem of this.purchaseItems) {
                if (purchaseItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += purchaseItem.cost * purchaseItem.quantity
                }
            }

            this.$charge.set(charge)
        })

        const purchaseOrderId = this.activatedRoute.snapshot.queryParams['purchaseOrderId']

        if (purchaseOrderId) {
            Object.assign(this.params, { purchaseOrderId })
            this.navigationService.loadBarStart()
            this.purchaseOrdersService.getPurchaseOrderById(purchaseOrderId).subscribe(purchaseOrder => {
                this.navigationService.loadBarFinish()
                this.$provider.set(purchaseOrder.provider)
                const purchaseItems: CreatePurchaseItemModel[] = []
                for (const purchaseOrderItem of purchaseOrder.purchaseOrderItems) {
                    const createdPurchaseItem: CreatePurchaseItemModel = {
                        fullName: purchaseOrderItem.fullName,
                        cost: purchaseOrderItem.cost,
                        price: purchaseOrderItem.price,
                        prices: purchaseOrderItem.prices,
                        quantity: purchaseOrderItem.quantity,
                        preIgvCode: purchaseOrderItem.igvCode,
                        igvCode: purchaseOrderItem.igvCode,
                        unitCode: purchaseOrderItem.unitCode,
                        isTrackStock: true,
                        productId: purchaseOrderItem.productId,
                    }
                    purchaseItems.push(createdPurchaseItem)
                }
                this.purchaseItems = purchaseItems
                this.purchasesService.setPurchaseItems(this.purchaseItems)
            })
        }
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const provider = this.$provider()

            const purchase: CreatePurchaseModel = {
                invoiceCode: formData.invoiceCode,
                serie: formData.serie,
                createdAt: formData.createdAt,
                expirationAt: formData.expirationAt,
                observation: formData.observation,
                providerId: provider ? provider.id : null,
            }

            if (this.purchaseItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            if (purchase.invoiceCode === InvoiceCode.FACTURA && provider === null) {
                throw new Error('Agrega un provedor')
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.purchasesService.create(purchase, this.purchaseItems, this.params).subscribe({
                next: () => {
                    this.purchasesService.setPurchaseItems([])
                    this.router.navigate(['/purchases'])
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        }
    }

    onEditProvider() {
        const dialogRef = this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$provider(),
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.$provider.set(provider)
            }
        })
    }

}
