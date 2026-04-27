import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Params, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { CustomerModel } from '../../customers/customer.model'
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component'
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component'
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreatePaymentModel } from '../../payments/create-payment.model'
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component'
import { PrintService } from '../../print/print.service'
import { CreateSaleModel } from '../../sales/create-sale.model'
import { SaleItemModel } from '../../sales/sale-item.model'
import { SaleForm } from '../../sales/sale.form'
import { SalesService } from '../../sales/sales.service'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { UserModel } from '../../users/user.model'
import { BoardModel } from '../../boards/board.model'
import { BoardsService } from '../../boards/boards.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { BoardItemsComponent } from '../../boards/board-items/board-items.component'
import { CreateBoardItemModel } from '../../boards/create-board-item.model'
import { InvoiceCode } from '../invoice-code.enum'
import { IgvCode } from '../igv-code.enum'

@Component({
    selector: 'app-charge-boards',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BoardItemsComponent],
    templateUrl: './charge-boards.component.html',
    styleUrls: ['./charge-boards.component.sass']
})
export class ChargeBoardsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly boardsService = inject(BoardsService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly turnsService = inject(TurnsService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    payments: CreatePaymentModel[] = []
    boardItems: CreateBoardItemModel[] = []
    $charge = signal<number>(0)
    $customer = signal<CustomerModel | null>(null)
    $isLoading = signal<boolean>(false)
    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '03',
        observation: '',
        cash: null,
        discount: null,
        discountPercent: null,
        isConsumption: false,
        createdAt: null,
        isRetainer: false,
        paymentMethodId: null,
    })
    cashChange: number = 0
    cash: number = 0

    invoiceCodes = [
        { code: '00', name: 'NOTA DE VENTA' },
        { code: '03', name: 'BOLETA' },
        { code: '01', name: 'FACTURA' },
    ]

    $setting = signal<SettingModel>(new SettingModel())
    $paymentMethods = signal<PaymentMethodModel[]>([])
    $isYesterdayTurn = signal<boolean>(false)
    $turn = signal<TurnModel | null>(null)

    private params: Params = {}
    private user: UserModel = new UserModel()
    private board: BoardModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleBoardItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleBoard$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleBoardItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleBoard$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cobrar')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.$setting.set(auth.setting)

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn().subscribe(turn => {
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

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
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

        this.handleBoard$ = this.boardsService.handleBoard().subscribe(board => {
            this.board = board
        })

        Object.assign(this.params, { boardId: this.board?.id })

        this.handleBoardItems$ = this.boardsService.handleBoardItems().subscribe(boardItems => {
            this.boardItems = boardItems
            this.$charge.set(0)
            let charge = 0

            for (const boardItem of this.boardItems) {
                if (boardItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += boardItem.price * boardItem.quantity
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

        for (const boardItem of this.boardItems) {
            if (boardItem.igvCode !== IgvCode.BONIFICACION) {
                charge += boardItem.price * boardItem.quantity
            }
        }

        this.$charge.set(charge - discount)
    }

    onChangeDiscountPercent() {
        let charge = 0
        let discount = 0

        const { discountPercent } = this.formGroup.value

        for (const boardItem of this.boardItems) {
            if (boardItem.igvCode !== IgvCode.BONIFICACION) {
                charge += boardItem.price * boardItem.quantity
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

            if (!this.boardItems.length) {
                throw new Error("Agrega un producto")
            }

            if (this.boardItems.find(e => e.price === 0 || e.price === null)) {
                throw new Error("El producto no puede tener precio 0")
            }

            const createdSale: CreateSaleModel = {
                invoiceCode: saleForm.invoiceCode,
                paymentMethodId: saleForm.paymentMethodId,
                observation: saleForm.observation,
                cash: saleForm.cash,
                currencyCode: 'PEN',
                discount: saleForm.discount,
                deliveryAt: null,
                createdAt: saleForm.createdAt,
                isRetainer: saleForm.isRetainer,
                isDelivery: saleForm.isDelivery,
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

            if (this.board === null) {
                throw new Error("No hemos encontrado la mesa")
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
                createdSale,
                this.boardItems,
                this.payments,
                null,
                this.params
            ).subscribe({
                next: sale => {
                    const saleItems: SaleItemModel[] = []

                    for (const boardItem of this.boardItems) {
                        saleItems.push({
                            id: 0,
                            productId: boardItem.productId,
                            sku: '',
                            upc: '',
                            fullName: boardItem.fullName,
                            price: boardItem.price,
                            quantity: boardItem.quantity,
                            preIgvCode: boardItem.preIgvCode,
                            igvCode: boardItem.igvCode,
                            unitCode: boardItem.unitCode,
                            unitName: 'UNIDADES',
                            unitShort: 'UNI',
                            isTrackStock: false,
                            observation: boardItem.observation,
                            createdAt: '',
                            saleId: 0,
                            categoryId: 0,
                            prices: [],
                            cost: 0
                        })
                    }

                    Object.assign(sale, {
                        user: this.user,
                        customer,
                        board: this.board,
                        saleItems,
                        payments: this.payments,
                    })

                    switch (this.$setting().defaultTicket) {
                        case '80MM':
                            this.printService.printTicket80mm(sale)
                            break
                        default:
                            this.printService.printTicket58mm(sale)
                            break
                    }

                    this.boardsService.setBoardItems([])
                    this.router.navigate(['/boards'])
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
