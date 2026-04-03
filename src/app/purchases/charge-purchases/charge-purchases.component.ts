import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
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
import { ProductsService } from '../../products/products.service'
import { IgvCode } from '../../products/igv-type.enum'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component'
import { InvoiceCode } from '../../sales/invoice-code.enum'

interface FormData {
    invoiceCode: string
    paymentMethodId: any
    purchasedAt: Date
    expirationAt: Date
    serie: string | null
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
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly productsService = inject(ProductsService)
    private readonly authService = inject(AuthService)

    payments: PaymentModel[] = []
    purchaseItems: CreatePurchaseItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '00',
        paymentMethodId: '',
        purchasedAt: new Date(),
        serie: null,
        observation: '',
    } as FormData)

    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]

    paymentMethods: PaymentMethodModel[] = []
    private setting = new SettingModel()

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comprar')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.navigationService.setMenu([
            { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { id: '' }).id })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_provider':
                    const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })

                    dialogRef.afterClosed().subscribe(provider => {
                        if (provider) {
                            this.provider = provider
                        }
                    })

                    dialogRef.componentInstance.handleAddProvider().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateProvidersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(provider => {
                            if (provider) {
                                this.provider = provider
                            }
                        })
                    })
                    break
                default:
                    break
            }
        })

        this.formGroup.get('invoiceCode')?.patchValue(this.setting.defaultInvoice)

        this.handlePurchaseItems$ = this.purchasesService.handlePurchaseItems().subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.charge = 0
            for (const purchaseItem of this.purchaseItems) {
                if (purchaseItem.igvCode !== IgvCode.BONIFICACION) {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const purchase: CreatePurchaseModel = {
                invoiceCode: formData.invoiceCode,
                isCredit: false,
                paymentMethodId: formData.paymentMethodId,
                serie: formData.serie,
                purchasedAt: formData.purchasedAt,
                expirationAt: formData.expirationAt,
                observation: formData.observation,
                providerId: this.provider ? this.provider.id : null,
            }

            if (this.purchaseItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            if (purchase.invoiceCode === InvoiceCode.FACTURA && this.provider === null) {
                throw new Error('Agrega un provedor')
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.purchasesService.create(purchase, this.purchaseItems).subscribe({
                next: () => {
                    for (const purchaseItem of this.purchaseItems) {
                        if (purchaseItem.isTrackStock === false) {
                            lastValueFrom(this.productsService.updateTrackStock(purchaseItem.productId))
                        }
                    }
                    this.purchasesService.setPurchaseItems([])
                    this.router.navigate(['/purchases'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.isLoading = false
            this.navigationService.loadBarFinish()
        }
    }

    onEditProvider() {
        this.matDialog.open(DialogEditProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.provider,
        })
    }

}
