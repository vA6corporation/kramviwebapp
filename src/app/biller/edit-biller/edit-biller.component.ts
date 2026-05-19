import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { SalesService } from '../../sales/sales.service'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { SaleModel } from '../../sales/sale.model'
import { UpdateSaleModel } from '../../sales/update-sale.model'
import { ProductItemModel } from '../product-item.model'
import { BillsService } from '../bills.service'
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { BillerItemsComponent } from '../biller-items/biller-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { InvoiceCode } from '../../sales/invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-edit-biller',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BillerItemsComponent, DirectivesModule],
    templateUrl: './edit-biller.component.html',
    styleUrls: ['./edit-biller.component.sass']
})
export class EditBillerComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly billsService = inject(BillsService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly matDialog = inject(MatDialog)
    private readonly authService = inject(AuthService)
    private readonly salesService = inject(SalesService)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '00',
        paymentMethodId: '',
        observation: '',
        cash: null,
        currencyCode: 'PEN',
        discount: null,
        isConsumption: false,
        isCredit: false,
        createdAt: new Date(),
    })

    payments: CreatePaymentModel[] = []
    $productItems = signal<ProductItemModel[]>([])
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(true)
    cash: number = 0
    private saleId: any = ''
    private sale: SaleModel | null = null

    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]

    $setting = signal<SettingModel>(new SettingModel())
    private office: OfficeModel = new OfficeModel()
    $paymentMethods = signal<PaymentMethodModel[]>([])

    private handleClickMenu$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleProductItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleProductItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Facturador')
        this.formGroup.get('invoiceCode')?.disable()
        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.navigationService.loadBarStart()
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.navigationService.loadBarFinish()
            this.$isLoading.set(false)
            this.sale = sale
            if (this.sale && this.sale.isCredit) {
                this.navigationService.showDialogMessage('Esta venta a sido generada al credito, debera revisar las cuotas pagadas si hace una modificacion')
                this.navigationService.setMenu([
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            } else {
                this.navigationService.setMenu([
                    { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
                    { id: 'add_customer', label: 'Desc Excel', icon: 'person_add', show: true },
                ])
            }
            this.$customer.set(sale.customer)
            this.formGroup.patchValue(sale)
            this.billsService.setProductItems(sale.saleItems as ProductItemModel[])
            this.navigationService.setTitle(`Editar ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.$paymentMethods.set(paymentMethods)
            this.formGroup.patchValue({ paymentMethodId: (paymentMethods[0] || { id: '' }).id })
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
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

        this.handleProductItems$ = this.billsService.handleProductItems().subscribe(productItems => {
            this.$productItems.set(productItems)
            this.$charge.set(0)
            let charge = 0

            for (const productItem of productItems) {
                if (productItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += productItem.price * productItem.quantity
                }
            }

            this.$charge.set(charge -= (this.sale?.discount || 0))
        })
    }

    onAddProduct() {
        this.matDialog.open(DialogAddProductComponent, {
            width: '600px',
            position: { top: '20px' },
        })
    }

    cashChange(): number {
        const diff = this.cash - this.$charge()
        return Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    addCash(cash: number) {
        this.cash += cash
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: string) {
        this.cash = Number(cash)
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.$charge.set(0)
        let charge = 0
        for (const productItem of this.$productItems()) {
            if (productItem.igvCode !== IgvCode.BONIFICACION) {
                charge += productItem.price * productItem.quantity
            }
        }
        this.$charge.set(charge -= discount)
    }

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onSubmit() {
        try {
            const customer = this.$customer()
            const productItems = this.$productItems()
            const setting = this.$setting()
            const charge = this.$charge()

            if (this.sale === null) {
                throw new Error('No hemos encontrado la venta')
            }

            if (productItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error('El producto no puede tener precio 0')
            }

            if (this.sale.invoiceCode === InvoiceCode.FACTURA && customer === null) {
                throw new Error('Agrega un cliente')
            }

            if (this.sale.invoiceCode === InvoiceCode.FACTURA && customer !== null && customer.documentType !== 'RUC') {
                throw new Error('El cliente debe tener un RUC')
            }

            const saleForm = this.formGroup.value

            const sale: UpdateSaleModel = {
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

            if (this.payments.length === 0 && charge) {
                const payment = {
                    charge,
                    paymentMethodId: saleForm.paymentMethodId,
                    turnId: this.sale.turnId,
                }
                this.payments.push(payment)
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.billsService.update(sale, productItems, this.payments, this.saleId).subscribe(createdSale => {
                this.billsService.setProductItems([])
                this.$isLoading.set(false)
                this.navigationService.loadBarFinish()
                this.router.navigate(['/sales'])
                this.navigationService.showMessage('Se han guardado los cambios')
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.$isLoading.set(false)
                this.navigationService.loadBarFinish()
            })
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
            this.$isLoading.set(false)
            this.navigationService.loadBarFinish()
        }
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
