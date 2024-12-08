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
import { PaymentModel } from '../../payments/payment.model';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { CreatePurchaseModel } from '../create-purchase.model';
import { PurchasesService } from '../purchases.service';
import { PurchaseOrdersService } from '../../purchase-orders/purchase-orders.service';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';
import { MaterialModule } from '../../material.module';
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component';
import { CommonModule } from '@angular/common';

interface FormData {
    invoiceType: string,
    paymentMethodId: string,
    purchasedAt: Date,
    expirationAt: Date,
    serie: string | null,
    observations: string,
}

@Component({
    selector: 'app-charge-credit',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './charge-credit.component.html',
    styleUrls: ['./charge-credit.component.sass']
})
export class ChargeCreditComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
        private readonly matDialog: MatDialog,
        private readonly authService: AuthService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    payments: PaymentModel[] = []
    purchaseItems: CreatePurchaseItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: 'NOTA DE VENTA',
        paymentMethodId: '',
        expirationAt: new Date(),
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
    purchaseOrderId: string | null = null
    private setting = new SettingModel()

    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comprar al credito')

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
                if (purchaseItem.igvCode !== '11') {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
        })
    }

    onSubmit() {
        try {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const formData: FormData = this.formGroup.value
            const purchase: CreatePurchaseModel = {
                invoiceType: formData.invoiceType,
                isCredit: true,
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

            this.purchasesService.createCredit(purchase, this.purchaseItems, this.purchaseOrderId).subscribe({
                next: () => {
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
