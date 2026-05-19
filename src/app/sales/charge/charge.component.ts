import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { DetractionModel } from '../../sales/detraction.model'
import { DialogDetractionComponent } from '../../sales/dialog-detraction/dialog-detraction.component'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { PrintService } from '../../print/print.service'
import { ProformasService } from '../../proformas/proformas.service'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { UserModel } from '../../users/user.model'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { CreateSaleModel } from '../create-sale.model'
import { DialogOutStockComponent } from '../dialog-out-stock/dialog-out-stock.component'
import { SaleItemsComponent } from '../sale-items/sale-items.component'
import { SaleForm } from '../sale.form'
import { SalesService } from '../sales.service'
import { DirectivesModule } from '../../directives/directives.module'
import { InvoiceCode } from '../invoice-code.enum'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-charge',
    imports: [MaterialModule, CommonModule, ReactiveFormsModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge.component.html',
    styleUrls: ['./charge.component.sass']
})
export class ChargeComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly turnsService = inject(TurnsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)
    private readonly proformasService = inject(ProformasService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        currencyCode: 'PEN',
        observation: '',
        discount: null,
        discountPercent: null,
        deliveryAt: null,
        createdAt: null,
        cash: null,
        isRetainer: false,
        paymentMethodId: null,
    })

    payments: CreatePaymentModel[] = []
    saleItems: CreateSaleItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal(false)
    cash: number = 0
    cashChange: number = 0
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    $setting = signal<SettingModel>(new SettingModel)
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $isYesterdayTurn = signal<boolean>(false)
    $turn = signal<TurnModel | null>(null)
    goTo: string = ''

    private uuid = crypto.randomUUID()
    private detraction: DetractionModel | null = null
    private user: UserModel = new UserModel()
    private params: Params = {}

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

        this.goTo = this.activatedRoute.snapshot.queryParams['goTo']

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.$paymentMethods.set(paymentMethods)
            this.formGroup.patchValue({ paymentMethodId: paymentMethods[0]?.id || null })
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.$setting.set(auth.setting)

            Object.assign(this.params, { isAvailableStock: auth.setting.isAvailableStock })

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

            if (this.$setting().isShowDeliveryAt) {
                this.formGroup.get('deliveryAt')?.setValidators([Validators.required])
                this.formGroup.get('deliveryAt')?.updateValueAndValidity()
            }

            if (this.$setting().isShowEmitionAt) {
                this.formGroup.get('createdAt')?.patchValue(new Date())
                this.formGroup.get('createdAt')?.setValidators([Validators.required])
                this.formGroup.get('createdAt')?.updateValueAndValidity()
            }

            this.formGroup.get('invoiceCode')?.patchValue(this.$setting().defaultInvoice)
            this.formGroup.get('currencyCode')?.patchValue(this.$setting().defaultCurrency)
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

            const { discount, discountPercent } = this.formGroup.value

            if (discountPercent) {
                let discount = (charge / 100) * discountPercent
                this.$charge.set(charge - discount)
                this.formGroup.patchValue({ discount })
            } else {
                this.$charge.set(charge - discount)
            }
        })

        const { proformaId } = this.activatedRoute.snapshot.queryParams

        if (proformaId) {
            Object.assign(this.params, { proformaId })
            this.proformasService.getProformaById(proformaId).subscribe(proforma => {
                const { proformaItems, customer, discount } = proforma
                this.salesService.setSaleItems(proformaItems)
                this.formGroup.patchValue(proforma)
                this.$charge.update(value => value -= (discount || 0))
                this.$customer.set(customer)
            })
        }
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

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
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

            if (!this.formGroup.valid) {
                throw new Error("Complete los campos")
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
                currencyCode: saleForm.currencyCode || 'PEN',
                discount: saleForm.discount,
                deliveryAt: saleForm.deliveryAt,
                createdAt: saleForm.createdAt,
                cash: saleForm.cash,
                isRetainer: saleForm.isRetainer,
                igvPercent: this.$setting().defaultIgvPercent,
                rcPercent: this.$setting().defaultRcPercent,
                turnId: turn.id,
                customerId: customer ? customer.id : null,
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
                this.detraction,
                this.params
            ).subscribe({
                next: sale => {

                    Object.assign(sale, {
                        customer,
                        user: this.user,
                        payments: this.payments,
                    })

                    switch (this.$setting().defaultTicket) {
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

                    this.salesService.setSaleItems([])

                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')

                    if (this.goTo) {
                        this.router.navigate([this.goTo])
                    } else {
                        this.navigationService.back()
                    }
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
