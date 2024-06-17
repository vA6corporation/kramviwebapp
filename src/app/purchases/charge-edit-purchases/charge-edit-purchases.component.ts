import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentModel } from '../../payments/payment.model';
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component';
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component';
import { ProviderModel } from '../../providers/provider.model';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { PurchasesService } from '../purchases.service';
import { UpdatePurchaseModel } from '../update-purchase.model';
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component';

interface FormData {
    invoiceType: string
    purchasedAt: Date
    createdAt: Date
    serie: string | null
    observations: string
    paymentMethodId: string
}

@Component({
    selector: 'app-charge-edit-purchases',
    templateUrl: './charge-edit-purchases.component.html',
    styleUrls: ['./charge-edit-purchases.component.sass']
})
export class ChargeEditPurchasesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: 'NOTA DE VENTA',
        paymentMethodId: '',
        purchasedAt: new Date(),
        createdAt: new Date(),
        serie: null,
        observations: '',
    } as FormData)
    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]
    payments: PaymentModel[] = []
    purchaseItems: CreatePurchaseItemModel[] = []
    charge: number = 0
    provider: ProviderModel | null = null
    isLoading: boolean = false

    paymentMethods: PaymentMethodModel[] = []
    private purchaseId: string | null = null

    private handlePaymentMethods$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        const purchase = this.purchasesService.getPurchase()
        if (purchase === null) {
            this.router.navigate(['purchases'])
        } else {
            this.purchaseId = purchase._id
            this.provider = purchase.provider
            this.navigationService.setTitle('Comprar')
            this.formGroup.patchValue(purchase)

            this.navigationService.setMenu([
                { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
            ])

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
    }

    onSubmit() {
        try {
            const formData: FormData = this.formGroup.value
            const purchase: UpdatePurchaseModel = {
                invoiceType: formData.invoiceType,
                serie: formData.serie,
                purchasedAt: formData.purchasedAt,
                createdAt: formData.createdAt,
                observations: formData.observations,
                paymentMethodId: formData.paymentMethodId,
                providerId: this.provider ? this.provider._id : null,
            }

            if (this.purchaseItems.length === 0) {
                throw new Error('Agrega un producto')
            }

            if (purchase.invoiceType === 'FACTURA' && this.provider === null) {
                throw new Error('Agrega un proveedor')
            }

            if (purchase.invoiceType === 'FACTURA' && this.provider?.documentType !== 'RUC') {
                throw new Error('El proveedor debe tener un RUC')
            }

            this.isLoading = true
            this.navigationService.loadBarStart()

            this.purchasesService.updatePurchase(purchase, this.purchaseItems, this.purchaseId || '').subscribe({
                next: () => {
                    this.purchasesService.setPurchaseItems([])
                    this.router.navigate(['/purchases'])
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
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
