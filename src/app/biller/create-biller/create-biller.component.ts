import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { CreateDueModel } from '../../dues/create-due.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { PaymentModel } from '../../payments/payment.model'
import { PrintService } from '../../print/print.service'
import { CreateSaleModel } from '../../sales/create-sale.model'
import { SaleForm } from '../../sales/sale.form'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { UserModel } from '../../users/user.model'
import { ProductItemModel } from '../product-item.model'
import { BillsService } from '../bills.service'
import { DialogAddProductComponent } from '../dialog-add-product/dialog-add-product.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { BillerItemsComponent } from '../biller-items/biller-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { DialogDetractionComponent } from '../dialog-detraction/dialog-detraction.component'
import { DetractionModel } from '../detraction.model'
import { InvoiceCode } from '../../sales/invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-create-biller',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BillerItemsComponent, DirectivesModule],
    templateUrl: './create-biller.component.html',
    styleUrls: ['./create-biller.component.sass']
})
export class CreateBillerComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly billsService = inject(BillsService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly turnsService = inject(TurnsService)
    private readonly matDialog = inject(MatDialog)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)
    private readonly router = inject(Router)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        observation: '',
        cash: null,
        currencyCode: 'PEN',
        discount: null,
        createdAt: '',
        isRetainer: false,

        paymentMethodId: null,
    })
    payments: CreatePaymentModel[] = []
    $productItems = signal<ProductItemModel[]>([])
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $setting = signal<SettingModel>(new SettingModel())
    private turn: TurnModel | null = null
    cash: number = 0
    dues: CreateDueModel[] = []
    private detraction: DetractionModel | null = null
    private user: UserModel = new UserModel()

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleProductItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()

    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleProductItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Emitir al contado')
        this.billsService.setProductItems([])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.$setting.set(auth.setting)

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogCreateTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })

            this.formGroup.get('invoiceCode')?.patchValue(this.$setting().defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.$setting().defaultCurrency)

            if (this.$setting().isShowEmitionAt) {
                this.formGroup.get('createdAt')?.patchValue(new Date())
                this.formGroup.get('createdAt')?.setValidators([Validators.required])
                this.formGroup.get('createdAt')?.updateValueAndValidity()
            }

        })

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.$paymentMethods.set(paymentMethods)
            this.formGroup.patchValue({ paymentMethodId: paymentMethods[0]?.id || null })
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
                    if (this.turn) {
                        const data: DialogSplitPaymentsData = {
                            turnId: this.turn.id,
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

        this.handleProductItems$ = this.billsService.handleProductItems().subscribe(productItems => {
            this.$productItems.set(productItems)
            this.$charge.set(0)
            let charge = 0
            for (const productItem of productItems) {
                if (productItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += productItem.price * productItem.quantity
                }
            }
            this.$charge.set(charge)
        })
    }

    onDialogDetraction() {
        const dialogRef = this.matDialog.open(DialogDetractionComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.detraction,
        })

        dialogRef.afterClosed().subscribe(detraction => {
            if (detraction) {
                this.detraction = detraction
            }
        })
    }

    onCancel() {
        const ok = confirm('Esta seguro de anular?...')
        if (ok) {
            this.$customer.set(null)
            this.billsService.setProductItems([])
        }
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

            if (this.turn === null) {
                this.matDialog.open(DialogCreateTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            if (!productItems.length) {
                throw new Error("Agrega un producto")
            }

            if (productItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const saleForm: SaleForm = this.formGroup.value

            const createdSale: CreateSaleModel = {
                invoiceCode: saleForm.invoiceCode,
                paymentMethodId: saleForm.paymentMethodId,
                observation: saleForm.observation,
                currencyCode: saleForm.currencyCode || 'PEN',
                discount: saleForm.discount,
                deliveryAt: saleForm.deliveryAt,
                createdAt: saleForm.createdAt,
                cash: saleForm.cash,
                isRetainer: saleForm.isRetainer,
                isDelivery: false,

                turnId: this.turn.id,
                customerId: customer ? customer.id : null,

                igvPercent: setting.defaultIgvPercent,
                rcPercent: setting.defaultRcPercent,
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceCode === InvoiceCode.FACTURA && customer !== null && customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            if (this.payments.length === 0 && charge) {
                const payment = {
                    charge,
                    paymentMethodId: saleForm.paymentMethodId,
                    turnId: this.turn.id
                }
                this.payments.push(payment)
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.billsService.save(
                createdSale,
                productItems,
                this.payments,
                this.dues,
                this.detraction
            ).subscribe({
                next: sale => {
                    Object.assign(sale, {
                        user: this.user,
                        customer,
                        saleItems: productItems,
                        payments: this.payments,
                    })

                    switch (setting.defaultTicket) {
                        case 'A4':
                            this.printService.printA4Invoice(sale)
                            break
                        case 'A5':
                            this.printService.printA5Invoice(sale)
                            break
                        case '80MM':
                            this.printService.printTicket80mm(sale)
                            break
                        default:
                            this.printService.printTicket58mm(sale)
                            break
                    }

                    this.billsService.setProductItems([])
                    this.dues = []
                    this.payments = []
                    this.formGroup.get('paymentMethodId')?.enable()
                    this.$customer.set(null)

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
