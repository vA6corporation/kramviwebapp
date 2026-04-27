import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { DialogAdminTurnsComponent } from '../dialog-admin-turns/dialog-admin-turns.component'
import { TurnModel } from '../turn.model'
import { TurnsService } from '../turns.service'
import { NavigationService } from '../../navigation/navigation.service'
import { SalesService } from '../../sales/sales.service'
import { UsersService } from '../../users/users.service'
import { AuthService } from '../../auth/auth.service'
import { ExpensesService } from '../../expenses/expenses.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { buildExcel } from '../../buildExcel'
import { UserModel } from '../../users/user.model'
import { MaterialModule } from '../../material.module'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { PaymentsService } from '../../payments/payments.service'

@Component({
    selector: 'app-turns',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './turns.component.html',
    styleUrls: ['./turns.component.sass']
})
export class TurnsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly navigationService = inject(NavigationService)
    private readonly turnsService = inject(TurnsService)
    private readonly salesService = inject(SalesService)
    private readonly usersService = inject(UsersService)
    private readonly authService = inject(AuthService)
    private readonly expensesService = inject(ExpensesService)
    private readonly paymentsService = inject(PaymentsService)

    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    displayedColumns: string[] = ['open', 'close', 'user', 'actions']
    $dataSource = signal<TurnModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    business: BusinessModel = new BusinessModel()
    office: OfficeModel = new OfficeModel()
    $users = signal<UserModel[]>([])
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cajas cerradas')

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()
        this.fetchCount()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            const { startDate, endDate } = this.formGroup.value
            if (startDate && endDate) {
                const chunk = 500
                const turns: TurnModel[] = []

                const dialogRef = this.matDialog.open(DialogProgressComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: this.$length() / chunk
                })

                for (let index = 0; index < this.$length() / chunk; index++) {
                    const values = await lastValueFrom(this.turnsService.getTurnsByPage(index + 1, chunk, this.params))
                    dialogRef.componentInstance.onComplete()
                    turns.push(...values)
                }

                const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                let body = [];
                body.push([
                    'F. APERTURA',
                    'H. APERTURA',
                    'F. CIERRE',
                    'H. CIERRE',
                    'USUARIO',
                ])
                for (const turn of turns) {
                    const { user } = turn
                    body.push([
                        formatDate(turn.createdAt, 'dd/MM/yyyy', 'en-US'),
                        formatDate(turn.createdAt, 'h:mm a', 'en-US'),
                        formatDate(turn.deletedAt, 'dd/MM/yyyy', 'en-US'),
                        formatDate(turn.deletedAt, 'h:mm a', 'en-US'),
                        user.name,
                    ])
                }
                const name = `CAJAS_${this.office.name.toUpperCase().replace(/ /g, '_')}`
                buildExcel(body, name, wscols, [], [])
            } else {
                this.navigationService.showMessage('Seleccione un rango de fechas')
            }
        })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value
            Object.assign(this.params, { startDate, endDate })
            const queryParams: Params = { startDate, endDate, pageIndex: 0, key: null }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchCount()
            this.fetchData()
        }
    }

    onUserChange(userId: any) {
        this.pageIndex = 0
        const queryParams: Params = { userId, key: null }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onClickOptions(event: MouseEvent, turn: TurnModel) {
        if (event.ctrlKey) {
            event.stopPropagation()
            const dialogRef = this.matDialog.open(DialogAdminTurnsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: turn,
            })

            dialogRef.componentInstance.handleUpdate().subscribe(() => {
                this.fetchData()
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onSummaryTurns(turn: TurnModel) {
        this.navigationService.loadBarStart()
        this.paymentsService.getSummaryPaymentsByTurn(turn.id).subscribe(async summaryTurns => {
            this.navigationService.loadBarFinish()
            let payments: any[] = []
            const expenses = await lastValueFrom(this.expensesService.getExpensesByTurn(turn.id))
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body: any[] = []
            let totalCollected = 0

            for (const summaryTurn of summaryTurns) {
                totalCollected += summaryTurn.totalCharge
                body.push([
                    summaryTurn.paymentMethod.name,
                    summaryTurn.totalCharge,
                ])
            }


            body.push([
                '',
                '',
            ])

            body.push([
                'TOTAL INGRESOS',
                totalCollected,
            ])

            body.push([
                '',
                '',
            ])

            let totalExpense = 0

            for (const expense of expenses) {
                body.push([
                    expense.concept,
                    expense.charge,
                ])

                totalExpense += expense.change
            }

            body.push([
                '',
                '',
            ])

            body.push([
                'TOTAL GASTOS',
                totalExpense,
            ])

            const name = `RESUMEN_CAJA_${formatDate(new Date(turn.createdAt), 'dd/MM/yyyy', 'en-US')}_${turn.user.name}`
            buildExcel(body, name, wscols, [])
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onRestoreTurn(turnId: number, userId: number) {
        this.turnsService.restore(turnId, userId).subscribe({
            next: () => {
                this.fetchData()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onExportExcelSales(turnId: any) {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnById(turnId).subscribe(async turn => {
            this.navigationService.loadBarFinish()

            const sales = await lastValueFrom(this.salesService.getSalesByTurn(turnId))
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. EMISION',
                'H. EMISION',
                'RUC/DNI/CE',
                'CLIENTE',
                'COMPROBANTE',
                'Nº COMPROBANTE',
                'MONEDA',
                'IMPORTE T.',
                'ANULADO',
                'FORMA PAGO'
            ])
            for (const sale of sales) {
                const { customer } = sale
                body.push([
                    formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                    formatDate(sale.createdAt, 'hh:mm a', 'en-US'),
                    customer?.document,
                    (customer?.name || 'VARIOS').toUpperCase(),
                    sale.invoiceName,
                    `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`,
                    sale.currencyCode,
                    sale.charge.toFixed(2),
                    sale.deletedAt ? 'SI' : 'NO',
                    sale.isPaid ? 'CONTADO' : 'CREDITO'
                ])
            }
            const name = `VENTAS_CAJA_${formatDate(turn.createdAt, 'dd/MM/yyyy', 'en-US')}_${turn.user.name}`
            buildExcel(body, name, wscols, [])
        })
    }

    fetchCount() {
        this.turnsService.getCountTurns(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnsByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
            next: turns => {
                this.navigationService.loadBarFinish()
                this.$dataSource.set(turns)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }
}
