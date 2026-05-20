import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { SaleForm } from '../sale.form'
import { SaleModel } from '../sale.model'
import { SalesService } from '../sales.service'
import { UpdateSaleModel } from '../update-sale.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { AuthService } from '../../auth/auth.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { CustomerModel } from '../../customers/customer.model'
import { SettingModel } from '../../settings/setting.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { SaleItemsComponent } from '../sale-items/sale-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { InvoiceCode } from '../invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-charge-edit',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-edit.component.html',
    styleUrls: ['./charge-edit.component.sass']
})
export class ChargeEditComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly authService = inject(AuthService)

    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    formGroup: FormGroup = this.formBuilder.group({
        invoiceNumber: null,
        invoiceCode: '03',
        currencyCode: 'PEN',
        observation: '',
        discount: null,
        isCredit: false,
        createdAt: Date(),
        paymentMethodId: null,
    })
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    $setting = signal<SettingModel>(new SettingModel())
    $paymentMethods = signal<PaymentMethodModel[]>([])
    private sale: SaleModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.sale = this.salesService.getSale()

        this.formGroup.get('invoiceCode')?.disable()

        if (this.sale === null) {
            this.router.navigate(['/sales'])
        } else {
            this.$customer.set(this.sale.customer)
            this.navigationService.setTitle('Guardar cambios')

            this.formGroup.patchValue(this.sale)

            if (this.sale.isCredit) {
                this.navigationService.setMenu([
                    // { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            } else {
                this.navigationService.setMenu([
                    { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            }

            this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
                this.$paymentMethods.set(paymentMethods)
                this.formGroup.patchValue({ paymentMethodId: (paymentMethods[0] || { id: '' }).id })
            })

            this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
                switch (id) {
                    case 'add_customer':
                        const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data: this.$setting().defaultSearchCustomer
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.$customer.set(customer)
                            }
                        })

                        dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                            const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                                width: '600px',
                                position: { top: '20px' },
                            })

                            dialogRef.afterClosed().subscribe(customer => {
                                if (customer) {
                                    this.$customer.set(customer)
                                }
                            })
                        })
                        break

                    case 'split_payment':
                        if (this.sale) {
                            const data: DialogSplitPaymentsData = {
                                turnId: this.sale.turnId,
                                charge: this.$charge(),
                                payments: this.payments,
                            }

                            const dialogRef = this.matDialog.open(DialogSplitPaymentsComponent, {
                                width: '600px',
                                position: { top: '20px' },
                                data,
                            })

                            dialogRef.afterClosed().subscribe(payments => {
                                if (payments) {
                                    this.payments = payments
                                    if (payments.length) {
                                        this.formGroup.get('paymentMethodId')?.disable()
                                    } else {
                                        this.formGroup.get('paymentMethodId')?.enable()
                                    }
                                }
                            })
                        }
                        break
                    default:
                        break
                }
            })

            this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
                this.$setting.set(auth.setting)
            })

            this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
                this.saleItems = saleItems
                this.$charge.set(0)
                let charge = 0

                for (const saleItem of this.saleItems) {
                    if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                        charge += saleItem.price * saleItem.quantity
                    }
                }

                charge -= (this.sale?.discount || 0)
                this.$charge.set(charge)
            })
        }
    }

    onSubmit() {
        try {
            const saleForm: SaleForm = this.formGroup.value
            const customer = this.$customer()
            const charge = this.$charge()

            if (this.sale === null) {
                throw new Error("La venta no existe")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const createdSale: UpdateSaleModel = {
                invoiceCode: this.sale.invoiceCode,
                currencyCode: saleForm.currencyCode || this.sale.currencyCode,
                paymentMethodId: saleForm.paymentMethodId,
                observation: saleForm.observation,
                createdAt: saleForm.createdAt,
                discount: saleForm.discount,
                igvPercent: this.sale.igvPercent,
                rcPercent: this.sale.rcPercent,
                cash: null,
                deliveryAt: null,
                isRetainer: false,
                isCredit: this.sale.isCredit,

                turnId: this.sale.turnId,
                customerId: customer ? customer.id : null,
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && customer !== null && customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            if (this.payments.length === 0 && charge && this.sale.isCredit === false) {
                const payment = {
                    charge,
                    paymentMethodId: saleForm.paymentMethodId,
                    turnId: this.sale.turnId,
                }
                this.payments.push(payment)
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.salesService.updateSaleWithItems(createdSale, this.saleItems, this.payments, this.sale.id).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.salesService.setSaleItems([])
                    this.router.navigate(['/sales'])
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
        }
    }

    onChangeDiscount() {
        this.$charge.set(0)
        let charge = 0

        const { discount } = this.formGroup.value

        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                charge += saleItem.price * saleItem.quantity
            }
        }

        this.$charge.set(charge - discount)
    }

    onChangeDiscountPercent() {
        let charge = 0
        let discount = 0

        const { discountPercent } = this.formGroup.value

        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                charge += saleItem.price * saleItem.quantity
            }
        }

        if (discountPercent) {
            discount = (charge / 100) * discountPercent
            this.$charge.set(charge - discount)
            this.formGroup.patchValue({ discount })
        } else {
            this.$charge.set(charge)
            this.formGroup.patchValue({ discount })
        }
    }

    onAddCustomer() {
        this.matDialog.open(DialogSearchCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
        })
    }

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.$customer(),
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.$customer.set(customer)
            }
        })
    }

}
