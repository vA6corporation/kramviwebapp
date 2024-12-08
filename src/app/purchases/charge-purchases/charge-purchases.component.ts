import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentModel } from '../../payments/payment.model';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { PurchaseOrdersService } from '../../purchase-orders/purchase-orders.service';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { CreatePurchaseModel } from '../create-purchase.model';
import { PurchasesService } from '../purchases.service';
import { ProductsService } from '../../products/products.service';
import { IgvType } from '../../products/igv-type.enum';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component';

interface FormData {
    invoiceType: string,
    paymentMethodId: string,
    purchasedAt: Date,
    expirationAt: Date,
    serie: string | null,
    observations: string,
}

@Component({
    selector: 'app-charge-purchases',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './charge-purchases.component.html',
    styleUrls: ['./charge-purchases.component.sass']
})
export class ChargePurchasesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly productsService: ProductsService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    payments: PaymentModel[] = []
    purchaseItems: CreatePurchaseItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: 'NOTA DE VENTA',
        paymentMethodId: '',
        purchasedAt: new Date(),
        serie: null,
        observations: '',
    } as FormData)

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]

    paymentMethods: PaymentMethodModel[] = []
    private setting = new SettingModel()
    private purchaseOrderId: string = ''

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

        this.purchaseOrderId = this.activatedRoute.snapshot.queryParams['purchaseOrderId']
        if (this.purchaseOrderId) {
            this.navigationService.loadBarStart()
            this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
                this.navigationService.loadBarFinish()
                this.provider = purchaseOrder.provider
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
                        isTrackStock: false,
                        productId: purchaseOrderItem.productId,
                        lot: null
                    }
                    purchaseItems.push(createdPurchaseItem)
                }
                this.purchaseItems = purchaseItems
                this.purchasesService.setPurchaseItems(this.purchaseItems)
            })
        }

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
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

        this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)

        this.handlePurchaseItems$ = this.purchasesService.handlePurchaseItems().subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.charge = 0
            for (const purchaseItem of this.purchaseItems) {
                if (purchaseItem.igvCode !== IgvType.BONIFICACION) {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const purchase: CreatePurchaseModel = {
                invoiceType: formData.invoiceType,
                isCredit: false,
                paymentMethodId: formData.paymentMethodId,
                serie: formData.serie,
                purchasedAt: formData.purchasedAt,
                expirationAt: formData.expirationAt,
                observations: formData.observations,
                providerId: this.provider ? this.provider._id : null,
            }

            if (this.purchaseItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            if (purchase.invoiceType === 'FACTURA' && this.provider === null) {
                throw new Error('Agrega un provedor')
            }

            if (purchase.invoiceType === 'FACTURA' && this.provider?.documentType !== 'RUC') {
                throw new Error('El proveedor debe tener un RUC')
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.purchasesService.create(purchase, this.purchaseItems, this.purchaseOrderId).subscribe(purchase => {
                for (const purchaseItem of this.purchaseItems) {
                    if (purchaseItem.isTrackStock === false) {
                        this.productsService.updateTrackStock(purchaseItem.productId)
                    }
                }
                this.purchasesService.setPurchaseItems([])
                this.router.navigate(['/purchases'])
                this.isLoading = false
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Registrado correctamente')
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.isLoading = false
                this.navigationService.loadBarFinish()
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
