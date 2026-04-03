import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { DialogOpenCashComponent } from '../dialog-open-cash/dialog-open-cash.component'
import { DialogCreateTurnsComponent } from '../dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../turn.model'
import { UserModel } from '../../users/user.model'
import { TurnsService } from '../turns.service'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreditsService } from '../../credits/credits.service'
import { PaymentsService } from '../../payments/payments.service'
import { ExpensesService } from '../../expenses/expenses.service'
import { SalesService } from '../../sales/sales.service'
import { PrintService, PrintTurnData } from '../../print/print.service'
import { AuthService } from '../../auth/auth.service'
import { PaymentModel } from '../../payments/payment.model'
import { ExpenseModel } from '../../expenses/expense.model'
import { CreditModel } from '../../credits/credit.model'
import { SummaryPaymentModel } from '../../payments/summary-payment.model'
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model'
import { SaleModel } from '../../sales/sale.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { DialogEditExpensesComponent } from '../../expenses/dialog-edit-expenses/dialog-edit-expenses.component'
import { DialogCreateExpensesComponent } from '../../expenses/dialog-create-expenses/dialog-create-expenses.component'
import { DialogObservationTurnComponent } from '../dialog-observation-turn/dialog-observation-turn.component'
import { DialogDetailSalesComponent } from '../../sales/dialog-detail-sales/dialog-detail-sales.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'
import { DialogSummarySaleItemsComponent } from '../dialog-summary-sale-items/dialog-summary-sale-items.component'

@Component({
    selector: 'app-open-turn',
    imports: [MaterialModule, CommonModule],
    templateUrl: './open-turn.component.html',
    styleUrls: ['./open-turn.component.sass']
})
export class OpenTurnComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly turnsService = inject(TurnsService)
    private readonly navigationService = inject(NavigationService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly creditsService = inject(CreditsService)
    private readonly paymentsService = inject(PaymentsService)
    private readonly expensesService = inject(ExpensesService)
    private readonly salesService = inject(SalesService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)

    $turn = signal<TurnModel | null>(null)
    openCash: number | null = null
    payments: PaymentModel[] = []
    $expenses = signal<ExpenseModel[]>([])
    credits: CreditModel[] = []
    $summaryPayments = signal<SummaryPaymentModel[]>([])
    $summarySaleItems = signal<SummarySaleItemModel[]>([])
    $sales = signal<SaleModel[]>([])
    paymentMethods: PaymentMethodModel[] = []
    user: UserModel | null = null

    totalCash: number = 0
    totalExpenses: number = 0
    totalCollected: number = 0
    totalCredit: number = 0
    totalDebt: number = 0

    paymentsCount: number = 0
    salesCount: number = 0
    turnId: any = 0

    office: OfficeModel = new OfficeModel()
    private setting: SettingModel = new SettingModel()

    private handleOpenTurn$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOpenTurn$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Estado de caja')
        this.navigationService.loadBarStart()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
            this.user = auth.user

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn().subscribe(turn => {
                this.navigationService.loadBarFinish()
                if (turn) {
                    this.$turn.set(turn)
                    this.turnId = turn.id
                    this.fetchData()
                    this.navigationService.setMenu([
                        { id: 'print_turn', label: 'Imprimir caja', icon: 'printer', show: false },
                        { id: 'change_open_charge', label: 'Modificar apertura', icon: 'info', show: false },
                        { id: 'add_observation', label: 'Agregar observaciones', icon: 'info', show: false },
                    ])
                } else {
                    this.$turn.set(null)
                    this.$summaryPayments.set([])
                    this.payments = []
                    this.$expenses.set([])
                }
            })
        })


        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'add_expense':
                    this.onAddExpense()
                    break
                case 'print_turn':
                    this.printTurn()
                    break
                case 'change_open_charge':
                    this.onEditOpenCharge()
                    break
                case 'add_observation':
                    this.onObservationTurn()
                    break
                default:
                    break
            }
        })
    }

    onSelectSaleProduct(saleIds: number[]) {
        this.matDialog.open(DialogSummarySaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleIds,
        })
    }

    onShowSale(saleId: any) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    printTurn() {
        const turn = this.$turn()
        if (turn && this.user) {
            Object.assign(turn, { user: this.user })
            this.navigationService.loadBarStart()
            this.salesService.getSummarySaleItemsByTurn(turn.id).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                const printTurnData: PrintTurnData = {
                    turn,
                    expenses: this.$expenses(),
                    summaryPayments: this.$summaryPayments(),
                    summarySaleItems
                }
                switch (this.setting.defaultTicket) {
                    case '80MM':
                        this.printService.printTurn80mm(printTurnData)
                        break
                    case '58MM':
                        this.printService.printTurn58mm(printTurnData)
                        break
                    default:
                        this.printService.printTurn80mm(printTurnData)
                        break
                }
            })
        }
    }

    onOpenTurn() {
        this.matDialog.open(DialogCreateTurnsComponent, {
            width: '600px',
            position: { top: '20px' }
        })
    }

    onObservationTurn() {
        const turn = this.$turn()
        if (turn) {
            this.matDialog.open(DialogObservationTurnComponent, {
                width: '600px',
                position: { top: '20px' },
                data: turn
            })
        }
    }

    onEditOpenCharge() {
        const turn = this.$turn()
        if (turn) {
            this.matDialog.open(DialogOpenCashComponent, {
                width: '600px',
                position: { top: '20px' },
                data: turn
            })
        }
    }

    onGetAllSales() {
        const turn = this.$turn()
        if (turn) {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByTurn(turn.id).subscribe({
                next: sales => {
                    this.navigationService.loadBarFinish()
                    this.$sales.set(sales)
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onGetSummarySales() {
        const turn = this.$turn()
        if (turn) {
            this.navigationService.loadBarStart()
            this.salesService.getSummarySaleItemsByTurn(turn.id).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                this.$summarySaleItems.set(summarySaleItems)
            })
        }
    }

    fetchData() {
        const turn = this.$turn()
        if (turn) {
            this.navigationService.loadBarStart()
            this.paymentsService.getSummaryPaymentsByTurn(turn.id).subscribe(summaryPayments => {
                this.navigationService.loadBarFinish()
                this.$summaryPayments.set(summaryPayments)
                this.totalCollected = summaryPayments.map(e => e.totalCharge).reduce((a, b) => a + b, 0)
                this.totalCash = (summaryPayments.find(e => e.paymentMethod.name === 'EFECTIVO') || { totalCharge: 0 }).totalCharge
            })

            this.expensesService.getExpensesByTurn(turn.id).subscribe(expenses => {
                this.$expenses.set(expenses)
                this.totalExpenses = 0
                for (const expense of this.$expenses()) {
                    this.totalExpenses += expense.charge
                }
            })

           // this.creditsService.getCreditsByTurn(turn.id).subscribe(credits => {
           //     this.credits = credits
           //     for (const credit of this.credits) {
           //         if (credit.isCredit) {
           //             this.totalCredit += credit.charge
           //         }
           //         if (credit.isPaid === false) {
           //             this.totalDebt += credit.debt
           //         }
           //     }
           // })
        }
    }

    onAddExpense() {
        const turn = this.$turn()
        if (turn) {
            const dialogRef = this.matDialog.open(DialogCreateExpensesComponent, {
                width: '600px',
                position: { top: '20px' },
                data: turn.id,
            })

            dialogRef.afterClosed().subscribe(expense => {
                if (expense) {
                    this.expensesService.create(expense).subscribe(() => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Registrado correctamente')
                        this.fetchData()
                    }, (error: HttpErrorResponse) => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    })
                }
            })
        }
    }

    onCloseTurn() {
        const turn = this.$turn()
        if (turn && this.user) {
            Object.assign(turn, { user: this.user })
            const ok = confirm('Esta seguro de cerrar la caja?...')
            if (ok) {
                this.navigationService.loadBarStart()
                const summaryPayments = this.$summaryPayments()
                const expenses = this.$expenses()
                this.turnsService.closeTurn(turn.id).subscribe(() => {
                    this.navigationService.showMessage('Caja cerrada correctamente')
                    this.salesService.getSummarySaleItemsByTurn(turn.id).subscribe(summarySaleItems => {
                        this.navigationService.loadBarFinish()
                        const printTurnData: PrintTurnData = {
                            turn,
                            expenses,
                            summaryPayments,
                            summarySaleItems
                        }
                        switch (this.setting.defaultTicket) {
                            case '80MM':
                                this.printService.printTurn80mm(printTurnData)
                                break
                            case '58MM':
                                this.printService.printTurn58mm(printTurnData)
                                break
                            default:
                                this.printService.printTurn80mm(printTurnData)
                                break
                        }
                        this.$turn.set(null)
                        this.$summaryPayments.set([])
                        this.$expenses.set([])
                        this.$sales.set([])
                    })
                })
            }
        }
    }

    onEditExpense(expense: ExpenseModel) {
        const dialogRef = this.matDialog.open(DialogEditExpensesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: expense,
        })

        dialogRef.componentInstance.handleDeleteExpense().subscribe(() => {
            this.navigationService.loadBarStart()
            this.expensesService.delete(expense.id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        })

        dialogRef.afterClosed().subscribe(updatedExpense => {
            if (updatedExpense) {
                this.navigationService.loadBarStart()
                this.expensesService.update(updatedExpense, expense.id).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.fetchData()
                        this.navigationService.showMessage('Se han guardado los cambios')
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.navigationService.loadBarFinish()
                    }
                })
            }
        })
    }

}
