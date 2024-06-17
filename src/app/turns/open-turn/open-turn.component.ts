import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogOpenCashComponent } from '../dialog-open-cash/dialog-open-cash.component';
import { DialogTurnsComponent } from '../dialog-turns/dialog-turns.component';
import { TurnModel } from '../turn.model';
import { TurnsService } from '../turns.service';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreditsService } from '../../credits/credits.service';
import { PaymentsService } from '../../payments/payments.service';
import { ExpensesService } from '../../expenses/expenses.service';
import { SalesService } from '../../sales/sales.service';
import { PrintService, PrintTurnData } from '../../print/print.service';
import { AuthService } from '../../auth/auth.service';
import { PaymentModel } from '../../payments/payment.model';
import { ExpenseModel } from '../../expenses/expense.model';
import { CreditModel } from '../../credits/credit.model';
import { SummaryPaymentModel } from '../../payments/summary-payment.model';
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model';
import { SaleModel } from '../../sales/sale.model';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { DialogEditExpensesComponent } from '../../expenses/dialog-edit-expenses/dialog-edit-expenses.component';
import { DialogCreateExpensesComponent } from '../../expenses/dialog-create-expenses/dialog-create-expenses.component';
import { DialogObservationTurnComponent } from '../dialog-observation-turn/dialog-observation-turn.component';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-open-turn',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './open-turn.component.html',
    styleUrls: ['./open-turn.component.sass']
})
export class OpenTurnComponent implements OnInit {

    constructor(
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly creditsService: CreditsService,
        private readonly paymentsService: PaymentsService,
        private readonly expensesService: ExpensesService,
        private readonly salesService: SalesService,
        private readonly printService: PrintService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
    ) { }

    turn: TurnModel | null = null
    openCash: number | null = null
    payments: PaymentModel[] = []
    expenses: ExpenseModel[] = []
    credits: CreditModel[] = []
    summaryPayments: SummaryPaymentModel[] = []
    summarySaleItems: SummarySaleItemModel[] = []
    sales: SaleModel[] = []
    paymentMethods: PaymentMethodModel[] = []

    totalCash: number = 0
    totalExpenses: number = 0
    totalCollected: number = 0
    totalCredit: number = 0
    totalDebt: number = 0

    paymentsCount: number = 0
    salesCount: number = 0
    turnId: string = ''

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

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(this.setting.isOfficeTurn).subscribe(turn => {
                this.navigationService.loadBarFinish()
                if (turn) {
                    this.turn = turn
                    this.turnId = turn._id
                    this.fetchData()
                    this.navigationService.setMenu([
                        { id: 'print_turn', label: 'Imprimir caja', icon: 'printer', show: false },
                        { id: 'change_open_charge', label: 'Modificar apertura', icon: 'info', show: false },
                        { id: 'add_observations', label: 'Agregar observaciones', icon: 'info', show: false },
                    ])
                } else {
                    this.turn = null
                    this.summaryPayments = []
                    this.payments = []
                    this.expenses = []
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
                case 'add_observations':
                    this.onObservationTurn()
                    break
                default:
                    break
            }
        })
    }

    onShowSale(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    printTurn() {
        if (this.turn) {
            const turn = this.turn
            this.navigationService.loadBarStart()
            this.salesService.getSummarySaleItemsByTurn(turn._id).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                const printTurnData: PrintTurnData = {
                    turn,
                    expenses: this.expenses,
                    summaryPayments: this.summaryPayments,
                    summarySaleItems
                }
                switch (this.setting.papelImpresion) {
                    case 'ticket80mm':
                        this.printService.printTurn80mm(printTurnData)
                        break
                    case 'ticket58mm':
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
        this.matDialog.open(DialogTurnsComponent, {
            width: '600px',
            position: { top: '20px' }
        })
    }

    onObservationTurn() {
        if (this.turn) {
            this.matDialog.open(DialogObservationTurnComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.turn
            })
        }
    }

    onEditOpenCharge() {
        if (this.turn) {
            this.matDialog.open(DialogOpenCashComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.turn
            })
        }
    }

    onGetAllSales() {
        if (this.turn) {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByTurn(this.turn._id).subscribe({
                next: sales => {
                    this.navigationService.loadBarFinish()
                    this.sales = sales
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onGetSummarySales() {
        if (this.turn) {
            this.navigationService.loadBarStart()
            this.salesService.getSummarySaleItemsByTurn(this.turn._id).subscribe(summarySaleItems => {
                this.navigationService.loadBarFinish()
                this.summarySaleItems = summarySaleItems
            })
        }
    }

    fetchData() {
        if (this.turn) {
            const turn = this.turn
            this.navigationService.loadBarStart()
            this.paymentsService.getSummaryPaymentsByTurn(turn._id).subscribe(summaryPayments => {
                this.navigationService.loadBarFinish()
                this.summaryPayments = summaryPayments
                this.totalCollected = summaryPayments.map(e => e.totalCharge).reduce((a, b) => a + b, 0)
                this.totalCash = (summaryPayments.find(e => e.paymentMethod.name === 'EFECTIVO') || { totalCharge: 0 }).totalCharge
            })

            this.expensesService.getExpensesByTurn(this.turn._id).subscribe(expenses => {
                this.expenses = expenses
                this.totalExpenses = 0
                for (const expense of this.expenses) {
                    this.totalExpenses += expense.charge
                }
            })

            this.creditsService.getCreditsByTurn(turn._id).subscribe(credits => {
                this.credits = credits
                for (const credit of this.credits) {
                    if (credit.isCredit) {
                        this.totalCredit += credit.charge
                    }
                    if (credit.isPaid === false) {
                        this.totalDebt += credit.debt
                    }
                }
            })
        }
    }

    onAddExpense() {
        const dialogRef = this.matDialog.open(DialogCreateExpensesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.turn?._id,
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

    onCloseTurn() {
        if (this.turn) {
            const ok = confirm('Esta seguro de cerrar la caja?...')
            if (ok) {
                this.navigationService.loadBarStart()
                const turn = this.turn
                const summaryPayments = this.summaryPayments
                const expenses = this.expenses
                this.turnsService.closeTurn(turn._id).subscribe(() => {
                    this.navigationService.showMessage('Caja cerrada correctamente')
                    this.salesService.getSummarySaleItemsByTurn(turn._id).subscribe(summarySaleItems => {
                        this.navigationService.loadBarFinish()
                        const printTurnData: PrintTurnData = {
                            turn,
                            expenses,
                            summaryPayments,
                            summarySaleItems
                        }
                        switch (this.setting.papelImpresion) {
                            case 'ticket80mm':
                                this.printService.printTurn80mm(printTurnData)
                                break
                            case 'ticket58mm':
                                this.printService.printTurn58mm(printTurnData)
                                break
                            default:
                                this.printService.printTurn80mm(printTurnData)
                                break
                        }
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
            this.expensesService.delete(expense._id).subscribe({
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
                this.expensesService.update(updatedExpense, expense._id).subscribe({
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
