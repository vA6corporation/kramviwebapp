import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { DialogChangeTurnComponent } from '../dialog-change-turn/dialog-change-turn.component'
import { DialogOpenCashComponent } from '../dialog-open-cash/dialog-open-cash.component'
import { DialogCreateTurnsComponent } from '../dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../turn.model'
import { TurnsService } from '../turns.service'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { SheetDetailTurnsComponent } from '../sheet-detail-turns/sheet-detail-turns.component'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentsService } from '../../payments/payments.service'
import { ExpensesService } from '../../expenses/expenses.service'
import { SalesService } from '../../sales/sales.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { CreditsService } from '../../credits/credits.service'
import { AuthService } from '../../auth/auth.service'
import { PrintService, PrintTurnData } from '../../print/print.service'
import { PaymentModel } from '../../payments/payment.model'
import { CreditModel } from '../../credits/credit.model'
import { SummaryPaymentModel } from '../../payments/summary-payment.model'
import { SummarySaleItemModel } from '../../sales/summary-sale-item.model'
import { SaleModel } from '../../sales/sale.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { DialogDetailSalesComponent } from '../../sales/dialog-detail-sales/dialog-detail-sales.component'
import { ExpenseModel } from '../../expenses/expense.model'
import { DialogCreateExpensesComponent } from '../../expenses/dialog-create-expenses/dialog-create-expenses.component'
import { DialogEditExpensesComponent } from '../../expenses/dialog-edit-expenses/dialog-edit-expenses.component'
import { MaterialModule } from '../../material.module'
import { DialogSummarySaleItemsComponent } from '../dialog-summary-sale-items/dialog-summary-sale-items.component'

@Component({
    selector: 'app-detail-turns',
    imports: [MaterialModule, CommonModule],
    templateUrl: './detail-turns.component.html',
    styleUrls: ['./detail-turns.component.sass']
})
export class DetailTurnsComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matBottomSheet = inject(MatBottomSheet)
    private readonly turnsService = inject(TurnsService)
    private readonly navigationService = inject(NavigationService)
    private readonly paymentsService = inject(PaymentsService)
    private readonly expensesService = inject(ExpensesService)
    private readonly salesService = inject(SalesService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly creditsService = inject(CreditsService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)

    $turn = signal<TurnModel | null>(null)
    openCash: number | null = null
    payments: PaymentModel[] = []
    $expenses = signal<ExpenseModel[]>([])
    $credits = signal<CreditModel[]>([])
    $summaryPayments = signal<SummaryPaymentModel[]>([])
    $summarySaleItems = signal<SummarySaleItemModel[]>([])
    $sales = signal<SaleModel[]>([])
    paymentMethods: PaymentMethodModel[] = []

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

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.loadBarStart()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.turnId = this.activatedRoute.snapshot.params['turnId']
        this.turnsService.getTurnById(this.turnId).subscribe(turn => {
            this.navigationService.loadBarFinish()
            if (turn) {
                this.$turn.set(turn)
                this.navigationService.setTitle(`Caja ${formatDate(turn.createdAt, 'dd/MM/yyyy', 'en-US')}`)
                this.fetchData()
            } else {
                this.$turn.set(null)
                this.payments = []
                this.$summaryPayments.set([])
            }
        })

        this.navigationService.setMenu([
            { id: 'print_turn', label: 'Imprimir caja', icon: 'printer', show: false },
            { id: 'close_turn', label: 'Cerrar caja', icon: 'close', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'print_turn':
                    this.printTurn()
                    break
                case 'close_turn':
                    this.onCloseTurn()
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

    printTurn() {
        const turn = this.$turn()
        if (turn) {
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

    printTurnDetail() {
        const turn = this.$turn()
        if (turn) {
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

    onShowSale(saleId: any) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onShowSheet(saleId: any) {
        const matBottomSheetRef = this.matBottomSheet.open(SheetDetailTurnsComponent, { data: saleId })
        matBottomSheetRef.instance.handleChangeTurn().subscribe(() => {
            const dialogRef = this.matDialog.open(DialogChangeTurnComponent, {
                width: '600px',
                position: { top: '20px' },
                data: saleId,
            })

            const subscription$ = dialogRef.componentInstance.onUpdate.subscribe(() => {
                this.$sales.set(this.$sales().filter(e => e.id !== saleId))
                subscription$.unsubscribe()
            })
        })
    }

    onOpenTurn() {
        this.matDialog.open(DialogCreateTurnsComponent, {
            width: '600px',
            position: { top: '20px' }
        })
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
            this.paymentsService.getSummaryPaymentsByTurn(turn.id).subscribe({
                next: summaryPayments => {
                    this.navigationService.loadBarFinish()
                    this.$summaryPayments.set(summaryPayments)
                    this.totalCollected = summaryPayments.map(e => e.totalCharge).reduce((a, b) => a + b, 0)
                    this.totalCash = (summaryPayments.find(e => e.paymentMethod.name === 'EFECTIVO') || { totalCharge: 0 }).totalCharge
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })

            this.expensesService.getExpensesByTurn(turn.id).subscribe(expenses => {
                this.$expenses.set(expenses)
                this.totalExpenses = 0
                for (const expense of this.$expenses()) {
                    this.totalExpenses += expense.charge
                }
            })

            this.creditsService.getCreditsByTurn(turn.id).subscribe(credits => {
                this.$credits.set(credits)
                for (const credit of credits) {
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

    onCloseTurn() {
        const turn = this.$turn()
        if (turn) {
            const ok = confirm('Esta seguro de cerrar la caja?...')
            if (ok) {
                this.navigationService.loadBarStart()
                this.turnsService.closeTurn(turn.id).subscribe(() => {
                    this.navigationService.showMessage('Caja cerrada correctamente')
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
                })
            }
        }
    }

}
