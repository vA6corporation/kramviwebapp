import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { CreateCreditModel } from '../create-credit.model'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { CreditForm } from '../credit.form'
import { DialogDueData, DialogDuesComponent } from '../dialog-dues/dialog-dues.component'
import { DialogOutStockComponent } from '../dialog-out-stock/dialog-out-stock.component'
import { DialogSaleItemsComponent } from '../dialog-sale-items/dialog-sale-items.component'
import { SalesService } from '../sales.service'
import { NavigationService } from '../../navigation/navigation.service'
import { ProformasService } from '../../proformas/proformas.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { TurnsService } from '../../turns/turns.service'
import { PrintService } from '../../print/print.service'
import { AuthService } from '../../auth/auth.service'
import { CustomerModel } from '../../customers/customer.model'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { CreateDueModel } from '../../dues/create-due.model'
import { SettingModel } from '../../settings/setting.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { UserModel } from '../../users/user.model'
import { TurnModel } from '../../turns/turn.model'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogInitPaymentsComponent } from '../../payments/dialog-init-payments/dialog-init-payments.component'
import { IgvCode } from '../../sales/igv-code.enum'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { MaterialModule } from '../../material.module'
import { SaleItemsComponent } from '../sale-items/sale-items.component'
import { DirectivesModule } from '../../directives/directives.module'
import { DetractionModel } from '../../sales/detraction.model'
import { DialogDetractionComponent } from '../../sales/dialog-detraction/dialog-detraction.component'
import { InvoiceCode } from '../../sales/invoice-code.enum'

@Component({
    selector: 'app-charge-credit',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, SaleItemsComponent, DirectivesModule],
    templateUrl: './charge-credit.component.html',
    styleUrls: ['./charge-credit.component.sass']
})
export class ChargeCreditComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly proformasService = inject(ProformasService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly salesService = inject(SalesService)
    private readonly turnsService = inject(TurnsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        currencyCode: 'PEN',
        observation: '',
        discount: null,
        createdAt: null,
        isRetainer: false,
    })
    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]
    saleItems: CreateSaleItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    $payments = signal<CreatePaymentModel[]>([])
    dues: CreateDueModel[] = []
    $setting = signal<SettingModel>(new SettingModel())
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $isYesterdayTurn = signal<boolean>(false)
    $turn = signal<TurnModel | null>(null)

    private goTo: string = ''
    private detraction: DetractionModel | null = null
    private user: UserModel = new UserModel()
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Credito')

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
        })

        this.navigationService.setMenu([
            { id: 'add_init_payment', label: 'Cuota inicial', icon: 'add_card', show: true },
            { id: 'add_dues', label: 'N° de cuotas', icon: 'event_available', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

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

                case 'add_dues': {
                    const turn = this.$turn()
                    if (turn) {
                        const data: DialogDueData = {
                            turnId: turn.id,
                            charge: this.$charge(),
                            dues: this.dues
                        }

                        const dialogRef = this.matDialog.open(DialogDuesComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data,
                        })

                        dialogRef.afterClosed().subscribe(dues => {
                            if (dues && dues.length) {
                                this.dues = dues
                            }
                        })
                    }
                    break
                }

                case 'add_init_payment': {
                    const turn = this.$turn()
                    if (turn) {
                        const dialogRef = this.matDialog.open(DialogInitPaymentsComponent, {
                            width: '600px',
                            position: { top: '20px' },
                            data: turn.id,
                        })

                        dialogRef.afterClosed().subscribe(payment => {
                            if (payment) {
                                this.$payments.set([payment])
                                this.dues[0].charge = this.dues[0].preCharge - payment.charge
                            }
                        })
                    }
                    break
                }
                default:
                    break
            }
        })

        this.formGroup.get('invoiceCode')?.patchValue(this.$setting().defaultInvoice)

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

            const now = new Date()

            const due: CreateDueModel = {
                charge: this.$charge(),
                preCharge: this.$charge(),
                dueAt: new Date(now.setMonth(now.getMonth() + 1)),
            }

            this.dues = [due]
        })

        const { proformaId, goTo } = this.activatedRoute.snapshot.queryParams

        this.goTo = goTo

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

    onClickSaleItem(index: number) {
        this.matDialog.open(DialogSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
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
            const creditForm: CreditForm = this.formGroup.value
            const customer = this.$customer()
            const charge = this.$charge()
            const payments = this.$payments()

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

            if (customer === null) {
                throw new Error("Agrega un cliente")
            }

            const createdCredit: CreateCreditModel = {
                invoiceCode: creditForm.invoiceCode,
                observation: creditForm.observation,
                turnId: turn.id,
                currencyCode: creditForm.currencyCode || 'PEN',
                discount: creditForm.discount,
                createdAt: creditForm.createdAt,
                isRetainer: creditForm.isRetainer,
                isCredit: true,
                customerId: customer.id,

                rcPercent: this.$setting().defaultRcPercent,
                igvPercent: this.$setting().defaultIgvPercent
            }

            if (createdCredit.invoiceCode === InvoiceCode.FACTURA && customer !== null && customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            this.$isLoading.set(true)
            this.navigationService.loadBarStart()

            this.salesService.createCredit(
                createdCredit, this.saleItems,
                payments,
                this.dues,
                this.detraction,
                this.params
            ).subscribe({
                next: sale => {
                    Object.assign(sale, {
                        user: this.user,
                        customer,
                        saleItems: this.saleItems,
                        payments,
                    })

                    switch (this.$setting().defaultTicket) {
                        case 'A4':
                            this.printService.printA4Invoice(sale)
                        break
                        case '80MM':
                            this.printService.printTicket80mm(sale)
                        break
                        default:
                            this.printService.printTicket58mm(sale)
                        break
                    }

                    this.salesService.setSaleItems([])

                    if (this.goTo) {
                        this.router.navigate([this.goTo])
                    } else {
                        this.navigationService.back()
                    }

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
