import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PaymentModel } from '../../payments/payment.model'
import { DialogCreateProvidersComponent } from '../../providers/dialog-create-providers/dialog-create-providers.component'
import { DialogEditProvidersComponent } from '../../providers/dialog-edit-providers/dialog-edit-providers.component'
import { ProviderModel } from '../../providers/provider.model'
import { CreatePurchaseItemModel } from '../create-purchase-item.model'
import { PurchasesService } from '../purchases.service'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { OfficesService } from '../../offices/offices.service'
import { OfficeModel } from '../../offices/office.model'
import { AuthService } from '../../auth/auth.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component'
import { InvoiceCode } from '../../sales/invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

interface FormData {
    invoiceCode: string
    createdAt: Date
    expirationAt: Date | null
    serie: string
    observation: string
}

@Component({
    selector: 'app-charge-edit-purchases',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './charge-edit-purchases.component.html',
    styleUrls: ['./charge-edit-purchases.component.sass']
})
export class ChargeEditPurchasesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly officesService = inject(OfficesService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '00',
        createdAt: new Date(),
        expirationAt: null,
        serie: '',
        observation: '',
    } as FormData)
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    payments: PaymentModel[] = []
    purchaseItems: CreatePurchaseItemModel[] = []
    $charge = signal<number>(0)
    $provider = signal<ProviderModel | null>(null)
    $isLoading = signal<boolean>(false)
    offices: OfficeModel[] = []
    params: Params = {}

    paymentMethods: PaymentMethodModel[] = []
    private purchaseId: any = ''

    private handlePaymentMethods$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handlePurchaseItems$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePurchaseItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        const purchase = this.purchasesService.getPurchase()
        if (purchase === null) {
            this.router.navigate(['purchases'])
        } else {
            this.purchaseId = purchase.id
            this.$provider.set(purchase.provider)
            this.navigationService.setTitle('Comprar')
            this.formGroup.patchValue(purchase)

            this.navigationService.setMenu([
                { id: 'add_provider', label: 'Agregar proveedor', icon: 'person_add', show: true },
            ])

            this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
                this.paymentMethods = paymentMethods
                this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { id: '' }).id })
            })

            this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
                this.offices = offices
                this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
                    this.formGroup.patchValue({ officeId: auth.office.id })
                })
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
        }
    }

    onOfficeChange() {
        const { officeId } = this.formGroup.value
        Object.assign(this.params, { officeId })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            try {
                const formData: FormData = this.formGroup.value
                const provider = this.$provider()
                const purchase = {
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
                    throw new Error('Agrega un proveedor')
                }

                if (purchase.invoiceCode === InvoiceCode.FACTURA && provider?.documentType !== 'RUC') {
                    throw new Error('El proveedor debe tener un RUC')
                }

                this.$isLoading.set(true)
                this.navigationService.loadBarStart()

                this.purchasesService.updatePurchase(purchase, this.purchaseItems, this.purchaseId, this.params).subscribe({
                    next: () => {
                        this.purchasesService.setPurchaseItems([])
                        this.router.navigate(['/purchases'])
                        this.$isLoading.set(false)
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Se han guardado los cambios')
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
