import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { DialogCreateCustomersComponent } from '../../customers/dialog-create-customers/dialog-create-customers.component';
import { DialogEditCustomersComponent } from '../../customers/dialog-edit-customers/dialog-edit-customers.component';
import { DialogSearchCustomersComponent } from '../../customers/dialog-search-customers/dialog-search-customers.component';
import { SpecialtyModel } from '../../events/specialty.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentModel } from '../../payments/create-payment.model';
import { DialogSplitPaymentsComponent, DialogSplitPaymentsData } from '../../payments/dialog-split-payments/dialog-split-payments.component';
import { PrintService } from '../../print/print.service';
import { CreateSaleModel } from '../../sales/create-sale.model';
import { SaleItemModel } from '../../sales/sale-item.model';
import { SaleForm } from '../../sales/sale.form';
import { SalesService } from '../../sales/sales.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { UserModel } from '../../users/user.model';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { BoardItemsComponent } from '../board-items/board-items.component';
import { CreateBoardItemModel } from '../create-board-item.model';

@Component({
    selector: 'app-charge-boards',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, BoardItemsComponent],
    templateUrl: './charge-boards.component.html',
    styleUrls: ['./charge-boards.component.sass']
})
export class ChargeBoardsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly boardsService: BoardsService,
        private readonly salesService: SalesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly turnsService: TurnsService,
        private readonly workersService: WorkersService,
        private readonly matDialog: MatDialog,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    payments: CreatePaymentModel[] = []
    boardItems: CreateBoardItemModel[] = []
    charge: number = 0
    customer: CustomerModel | null = null
    isLoading: boolean = false
    formGroup: FormGroup = this.formBuilder.group({
        addressIndex: 0,
        invoiceType: 'NOTA DE VENTA',
        observations: '',
        cash: null,
        discount: null,
        isConsumption: false,
        emitionAt: null,
        isRetainer: false,

        paymentMethodId: null,
        workerId: null,
        referredId: null,
        specialtyId: null,
    })
    cashChange: number = 0
    cash: number = 0
    workers: WorkerModel[] = []
    specialties: SpecialtyModel[] = []
    addresses: string[] = []

    invoiceTypes = [
        { code: 'NOTA DE VENTA', name: 'NOTA DE VENTA' },
        { code: 'BOLETA', name: 'BOLETA' },
        { code: 'FACTURA', name: 'FACTURA' },
    ]

    setting = new SettingModel()
    paymentMethods: PaymentMethodModel[] = []
    private params: Params = {}
    private user: UserModel = new UserModel()
    private turn: TurnModel | null = null
    private board: BoardModel | null = null

    private handleClickMenu$: Subscription = new Subscription()
    private handleOpenTurn$: Subscription = new Subscription()
    private handleBoardItems$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleBoardItems$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleWorkers$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cobrar')
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.setting = auth.setting

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })

            this.formGroup.get('invoiceType')?.patchValue(this.setting.defaultInvoice)
            this.formGroup.get('isConsumption')?.patchValue(this.setting.isConsumption)

            if (this.setting.showEmitionAt) {
                this.formGroup.get('emitionAt')?.patchValue(new Date())
                this.formGroup.get('emitionAt')?.setValidators([Validators.required])
                this.formGroup.get('emitionAt')?.updateValueAndValidity()
            }

        })

        this.navigationService.setMenu([
            { id: 'split_payment', label: 'Dividir pago', icon: 'add_card', show: true },
            { id: 'add_customer', label: 'Agregar cliente', icon: 'person_add', show: true },
        ])

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_customer':
                    const dialogRef = this.matDialog.open(DialogSearchCustomersComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.setting.defaultSearchCustomer
                    })

                    dialogRef.afterClosed().subscribe(customer => {
                        if (customer) {
                            this.customer = customer
                            this.addresses = customer.addresses
                        }
                    })

                    dialogRef.componentInstance.handleCreateCustomer().subscribe(() => {
                        const dialogRef = this.matDialog.open(DialogCreateCustomersComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(customer => {
                            if (customer) {
                                this.customer = customer
                                this.addresses = customer.addresses
                            }
                        })
                    })
                    break

                case 'split_payment':
                    if (this.turn) {
                        const data: DialogSplitPaymentsData = {
                            turnId: this.turn._id,
                            charge: this.charge,
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

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.board = this.boardsService.getBoard()

        Object.assign(this.params, { boardId: this.board?._id })

        this.handleBoardItems$ = this.boardsService.handleBoardItems().subscribe(boardItems => {
            this.boardItems = boardItems
            this.charge = 0
            for (const boardItem of this.boardItems) {
                if (boardItem.igvCode !== '11') {
                    this.charge += boardItem.price * boardItem.quantity
                }
            }
        })
    }

    addCash(cash: number) {
        this.cash = Number(this.cash)
        this.cash += cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toFixed(2))
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    setCash(cash: any) {
        this.cash = cash
        const diff = Number(this.cash) - Number(this.charge)
        this.cashChange = Number(diff.toFixed(2))
    }

    resetCash() {
        this.cash = 0
        this.formGroup.get('cash')?.patchValue(this.cash)
    }

    onChangeDiscount() {
        const { discount } = this.formGroup.value
        this.charge = 0
        for (const boardItem of this.boardItems) {
            if (boardItem.igvCode !== '11') {
                this.charge += boardItem.price * boardItem.quantity
            }
        }
        this.charge -= discount
    }

    onSubmit() {
        this.isLoading = true
        this.navigationService.loadBarStart()

        try {
            if (this.turn === null) {
                this.matDialog.open(DialogTurnsComponent, {
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

            const saleForm: SaleForm = this.formGroup.value

            const createdSale: CreateSaleModel = {
                addressIndex: saleForm.addressIndex,
                invoiceType: saleForm.invoiceType,
                paymentMethodId: saleForm.paymentMethodId,
                observations: saleForm.observations,
                cash: saleForm.cash,
                currencyCode: 'PEN',
                discount: saleForm.discount,
                deliveryAt: null,
                emitionAt: saleForm.emitionAt,
                isRetainer: saleForm.isRetainer,

                turnId: this.turn._id,
                customerId: this.customer ? this.customer._id : null,
                workerId: saleForm.workerId,
                referredId: saleForm.referredId,
                specialtyId: saleForm.specialtyId,

                igvPercent: this.setting.defaultIgvPercent,
                rcPercent: this.setting.defaultRcPercent,
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer === null) {
                throw new Error("Agrega un cliente")
            }

            if (createdSale.invoiceType === 'FACTURA' && this.customer !== null && this.customer.documentType !== 'RUC') {
                throw new Error("El cliente debe tener un RUC")
            }

            if (this.board === null) {
                throw new Error("No hemos encontrado la mesa")
            }

            this.salesService.createSale(
                createdSale,
                this.boardItems,
                this.payments,
                [],
                null,
                this.params
            ).subscribe({
                next: sale => {
                    const saleItems: SaleItemModel[] = []

                    for (const boardItem of this.boardItems) {
                        saleItems.push({
                            _id: '',
                            productId: boardItem.productId,
                            sku: '',
                            upc: '',
                            fullName: boardItem.fullName,
                            onModel: 'Product',
                            price: boardItem.price,
                            quantity: boardItem.quantity,
                            preIgvCode: boardItem.preIgvCode,
                            igvCode: boardItem.igvCode,
                            unitCode: boardItem.unitCode,
                            unitName: 'UNIDADES',
                            unitShort: 'UNI',
                            isTrackStock: false,
                            observations: boardItem.observations,
                            createdAt: '',
                            saleId: '',
                            categoryId: '',
                            recipes: [],
                            prices: [],
                            cost: 0
                        })
                    }

                    let payments: CreatePaymentModel[] = []

                    if (this.payments.length) {
                        payments = this.payments
                    } else {
                        payments[0] = {
                            paymentMethodId: createdSale.paymentMethodId || '',
                            charge: sale.charge,
                            turnId: sale.turnId,
                            createdAt: new Date(),
                        }
                    }

                    Object.assign(sale, {
                        user: this.user,
                        customer: this.customer,
                        board: this.board,
                        saleItems,
                        worker: this.workers.find(e => e._id === sale.workerId),
                        referred: this.workers.find(e => e._id === sale.referredId),
                        payments,
                    })

                    switch (this.setting.papelImpresion) {
                        case 'ticket58mm':
                            this.printService.printTicket58mm(sale)
                            break
                        default:
                            this.printService.printTicket80mm(sale)
                            break
                    }

                    this.boardsService.setBoardItems([])
                    this.router.navigate(['/boards'])
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

    onEditCustomer() {
        const dialogRef = this.matDialog.open(DialogEditCustomersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.customer,
        })

        dialogRef.afterClosed().subscribe(customer => {
            if (customer) {
                this.customer = customer
                this.addresses = customer.addresses
            }
        })
    }

}
