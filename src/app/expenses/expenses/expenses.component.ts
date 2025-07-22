import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { DialogCreateExpensesComponent } from '../dialog-create-expenses/dialog-create-expenses.component';
import { ExpenseModel } from '../expense.model';
import { ExpensesService } from '../expenses.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-expenses',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.sass'],
})
export class ExpensesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly expensesService: ExpensesService,
        private readonly turnsService: TurnsService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    displayedColumns: string[] = ['createdAt', 'concept', 'charge', 'user', 'actions']
    dataSource: ExpenseModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    private turn: TurnModel | null = null

    private handleOpenTurn$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleOpenTurn$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Gastos')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.handleOpenTurn$ = this.turnsService.handleOpenTurn(auth.setting.isOfficeTurn).subscribe(turn => {
                this.turn = turn
            })
        })

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        this.fetchData()

        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        const { startDate, endDate } = this.formGroup.value

        this.expensesService.getCountExpensesByRangeDate(startDate, endDate).subscribe(count => {
            this.length = count
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'excel_simple':
                    const { startDate, endDate } = this.formGroup.value
                    this.expensesService.getExpensesByRangeDate(startDate, endDate).subscribe(expenses => {
                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                        let body = []
                        body.push([
                            'F. REGISTRO',
                            'CONCEPTO',
                            'MONTO',
                            'USUARIO',
                        ])
                        for (const expense of expenses) {
                            body.push([
                                formatDate(expense.createdAt, 'dd/MM/yyyy', 'en-US'),
                                expense.concept.toUpperCase(),
                                Number((expense.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                                expense.user.name
                            ])
                        }
                        const name = `GASTOS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}`
                        buildExcel(body, name, wscols, [], [])
                    })
                    break

                default:
                    break
            }
        })
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
    }

    onAddExpense() {
        if (this.turn === null) {
            this.matDialog.open(DialogTurnsComponent, {
                width: '600px',
                position: { top: '20px' }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogCreateExpensesComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.turn._id,
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

    onDelete(expenseId: string) {
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

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0 }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()

            this.expensesService.getCountExpensesByRangeDate(startDate, endDate).subscribe(count => {
                this.length = count
            })
        }
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            const { startDate, endDate } = this.formGroup.value
            this.expensesService.getExpensesByRangeDatePage(startDate, endDate, this.pageIndex + 1, this.pageSize).subscribe(expenses => {
                this.navigationService.loadBarFinish()
                this.dataSource = expenses
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        }
    }
}
