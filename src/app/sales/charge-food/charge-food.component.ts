import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { CreateSaleModel } from '../create-sale.model'
import { SaleForm } from '../sale.form'
import { SalesService } from '../sales.service'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { TurnsService } from '../../turns/turns.service'
import { PrintService } from '../../print/print.service'
import { AuthService } from '../../auth/auth.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { CustomerModel } from '../../customers/customer.model'
import { SettingModel } from '../../settings/setting.model'
import { TurnModel } from '../../turns/turn.model'
import { UserModel } from '../../users/user.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { MaterialModule } from '../../material.module'
import { SaleItemsComponent } from '../sale-items/sale-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { ActivatedRoute, Router } from '@angular/router'
import { InvoiceCode } from '../../sales/invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-charge-food',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-food.component.html',
    styleUrl: './charge-food.component.sass',
})
export class ChargeFoodComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly turnsService = inject(TurnsService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        observation: '',
        cash: null,
        currencyCode: 'PEN',
        discount: null,
        isConsumption: false,
        createdAt: null,
        isRetainer: false,
        paymentMethodId: null,
    })
    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    cash: number = 0
    cashChange: number = 0
    $setting = signal<SettingModel>(new SettingModel())
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $isYesterdayTurn = signal<boolean>(false)
    $turn = signal<TurnModel | null>(null)

    private uuid = crypto.randomUUID()
    private user: UserModel = new UserModel()

    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cobrar')

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.$setting.set(auth.setting)

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.$turn.set(turn)
                if (turn) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const turnDate = new Date(turn.createdAt)
                    turnDate.setHours(0, 0, 0, 0)
                    if (turnDate.getMonth() === today.getMonth() && turnDate.getDate() < today.getDate()) {
                        this.$isYesterdayTurn.set(true)
                    } else {
                        if (turnDate.getMonth() !== today.getMonth()) {
                            this.$isYesterdayTurn.set(true)
                        }
                    }
                } else {
                    this.matDialog.open(DialogCreateTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })

            if (this.$setting().isShowEmitionAt) {
                this.formGroup.get('createdAt')?.patchValue(new Date())
                this.formGroup.get('createdAt')?.setValidators([Validators.required])
                this.formGroup.get('createdAt')?.updateValueAndValidity()
            }

            this.formGroup.get('invoiceCode')?.patchValue(this.$setting().defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.$setting().defaultCurrency)
        })

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
                    const turn = this.$turn()
                    if (turn) {
                        const data: DialogSplitPaymentsData = {
                            turnId: turn.id,
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

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.$charge.set(0)
            let charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += saleItem.price * saleItem.quantity
                }
            }
            this.$charge.set(charge)
        })
    }

    addCash(cash: number) {
        this.cash = Number(this.cash)
        this.cash += cash
        const diff = Number(this.cash) - Number(this.$charge())
        this.cashChange = Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: any) {
        this.cash = cash
        const diff = Number(this.cash) - Number(this.$charge())
        this.cashChange = Number(diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.$charge.set(0)
        let charge = 0
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                charge += saleItem.price * saleItem.quantity
            }
        }
        this.$charge.set(charge - discount)
    }

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onSubmit() {
        try {
            const turn = this.$turn()
            const saleForm: SaleForm = this.formGroup.value
            const customer = this.$customer()
            const charge = this.$charge()

            if (turn === null) {
                this.matDialog.open(DialogCreateTurnsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })
                throw new Error("Debes aperturar una caja")
            }

            if (!this.saleItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.saleItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }


            const createdSale: CreateSaleModel = {
                invoiceCode: saleForm.invoiceCode,
                paymentMethodId: saleForm.paymentMethodId,
                observation: saleForm.observation,
                cash: saleForm.cash,
                currencyCode: saleForm.currencyCode || 'PEN',
                discount: saleForm.discount,
                createdAt: saleForm.createdAt,
                isRetainer: saleForm.isRetainer,

                turnId: turn.id,
                customerId: customer ? customer.id : null,

                igvPercent: this.$setting().defaultIgvPercent,
                rcPercent: this.$setting().defaultRcPercent
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
                    turnId: turn.id
                }
                this.payments.push(payment)
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.salesService.createSale(
                this.uuid,
                createdSale,
                this.saleItems,
                this.payments,
                null,
                {}
            ).subscribe({
                next: sale => {
                    const saleItems = JSON.parse(JSON.stringify(this.saleItems))

                    for (const saleItem of saleItems) {
                        saleItem.printZone = 'COCINA'
                    }

                    Object.assign(sale, {
                        user: this.user,
                        customer: customer,
                        saleItems,
                        payments: this.payments,
                    })

                    this.printService.printTicket80mm(sale)
                    this.printService.printCommandFastFood80mm(sale)

                    this.salesService.setSaleItems([])

                    this.navigationService.back()
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
