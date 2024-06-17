import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { DialogAdminTurnsComponent } from '../dialog-admin-turns/dialog-admin-turns.component';
import { TurnModel } from '../turn.model';
import { TurnsService } from '../turns.service';
import { NavigationService } from '../../navigation/navigation.service';
import { SalesService } from '../../sales/sales.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { ExpensesService } from '../../expenses/expenses.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { UserModel } from '../../users/user.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-turns',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './turns.component.html',
    styleUrls: ['./turns.component.sass']
})
export class TurnsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly turnsService: TurnsService,
        private readonly salesService: SalesService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly expensesService: ExpensesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        userId: '',
    })
    displayedColumns: string[] = ['open', 'close', 'user', 'actions']
    dataSource: TurnModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    business: BusinessModel = new BusinessModel()
    office: OfficeModel = new OfficeModel()
    users: UserModel[] = []
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
            this.users = users
        })

        const { pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.fetchData()
        this.fetchCount()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
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

    onExportExcel(turnId: string) {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnById(turnId).subscribe(async turn => {
            this.navigationService.loadBarFinish()
            let payments: any[] = []
            const expenses = await lastValueFrom(this.expensesService.getExpensesByTurn(turnId))
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body: any[] = []

            let totalCash = 0
            let totalVisa = 0
            let totalMastercard = 0
            let totalAmericanExpress = 0
            let totalYape = 0
            let totalPlin = 0
            let totalTransferencia = 0
            let totalDeposito = 0
            let totalOnline = 0
            let totalCollected = 0

            for (const payment of payments) {
                if (payment.deletedAt) {
                    continue
                }
                totalCollected += payment.charge
                switch (payment.paymentType) {
                    case 'EFECTIVO':
                        totalCash += payment.charge
                        break
                    case 'VISA':
                        totalVisa += payment.charge
                        break
                    case 'MASTERCARD':
                        totalMastercard += payment.charge
                        break
                    case 'AMERICAN EXPRESS':
                        totalAmericanExpress += payment.charge
                        break
                    case 'YAPE':
                        totalYape += payment.charge
                        break
                    case 'PLIN':
                        totalPlin += payment.charge
                        break
                    case 'TRANSFERENCIA':
                        totalTransferencia += payment.charge
                        break
                    case 'DEPOSITO':
                        totalDeposito += payment.charge
                        break
                    case 'ONLINE':
                        totalOnline += payment.charge
                        break
                    default:
                        break
                }
            }

            body.push([
                'EFECTIVO',
                totalCash,
            ])

            body.push([
                'VISA',
                totalVisa,
            ])

            body.push([
                'MASTERCARD',
                totalMastercard,
            ])

            body.push([
                'AMERICAN EXPRESS',
                totalAmericanExpress,
            ])

            body.push([
                'AMERICAN EXPRESS',
                totalAmericanExpress,
            ])

            body.push([
                'YAPE',
                totalYape,
            ])

            body.push([
                'PLIN',
                totalPlin,
            ])

            body.push([
                'TRANSFERENCIA',
                totalTransferencia,
            ])

            body.push([
                'DEPOSITO',
                totalDeposito,
            ])

            body.push([
                'ONLINE',
                totalOnline,
            ])

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

    onExportExcelSales(turnId: string) {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnById(turnId).subscribe(async turn => {
            this.navigationService.loadBarFinish()

            const sales = await lastValueFrom(this.salesService.getSalesByTurn(turnId))
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. EMISION',
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
                    customer?.document,
                    (customer?.name || 'VARIOS').toUpperCase(),
                    sale.invoiceType,
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
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.turnsService.getTurnsByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(turns => {
            this.navigationService.loadBarFinish()
            this.dataSource = turns
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }
}
