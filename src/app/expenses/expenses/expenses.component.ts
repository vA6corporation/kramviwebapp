import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { buildExcel } from '../../buildExcel'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { DialogCreateExpensesComponent } from '../dialog-create-expenses/dialog-create-expenses.component'
import { ExpenseModel } from '../expense.model'
import { ExpensesService } from '../expenses.service'
import { AuthService } from '../../auth/auth.service'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'

@Component({
    selector: 'app-expenses',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.sass'],
})
export class ExpensesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly router = inject(Router)
    private readonly navigationService = inject(NavigationService)
    private readonly expensesService = inject(ExpensesService)
    private readonly turnsService = inject(TurnsService)
    private readonly authService = inject(AuthService)
    private readonly usersService = inject(UsersService)

    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        userId: '',
    })
    displayedColumns: string[] = ['createdAt', 'deletedAt', 'concept', 'charge', 'user', 'actions']
    $dataSource = signal<ExpenseModel[]>([])
    $length = signal<number>(0)
    $users = signal<UserModel[]>([])
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    private turn: TurnModel | null = null
    private params: Params = {}

    private handleOpenTurn$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Gastos')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
            })
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams

        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        this.fetchData()
        this.fetchCount()

        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_simple':
                    const { startDate, endDate } = this.formGroup.value
                    if (startDate && endDate) {
                        this.navigationService.loadBarStart()
                        this.expensesService.getExpensesByPage(1, 10000, { startDate, endDate }).subscribe(expenses => {
                            this.navigationService.loadBarFinish()
                            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                            let body = []
                            body.push([
                                'F. REGISTRO',
                                'CONCEPTO',
                                'MONTO',
                                'USUARIO',
                                'ANULADO',
                            ])
                            for (const expense of expenses) {
                                body.push([
                                    formatDate(expense.createdAt, 'dd/MM/yyyy', 'en-US'),
                                    expense.concept.toUpperCase(),
                                    Number((expense.charge || 0).toFixed(2)),
                                    expense.user.name,
                                    expense.deletedAt ? 'SI' : 'NO'
                                ])
                            }
                            const name = `GASTOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
                            buildExcel(body, name, wscols, [], [])
                        })
                    } else {
                        this.navigationService.showMessage('Seleccione un rango de fechas')
                    }
                    break

                default:
                    break
            }
        })
    }

    onUserChange(userId: string) {
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

    onAddExpense() {
        if (this.turn === null) {
            this.matDialog.open(DialogCreateTurnsComponent, {
                width: '600px',
                position: { top: '20px' }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogCreateExpensesComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.turn.id,
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

    onDeleteExpense(expenseId: any) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.expensesService.delete(expenseId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.fetchData()
            })
        }
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value
            const queryParams: Params = { startDate, endDate, pageIndex: 0, key: '' }
            Object.assign(this.params, queryParams)

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        }
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.expensesService.getExpensesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(expenses => {
            this.navigationService.loadBarFinish()
            this.$dataSource.set(expenses)
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    fetchCount() {
        this.expensesService.getCountExpenses(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

}
