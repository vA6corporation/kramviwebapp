import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { CustomerModel } from '../../customers/customer.model'
import { CreateDueModel } from '../../dues/create-due.model'
import { DuesService } from '../../dues/dues.service'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { DialogCreatePaymentData, DialogCreatePaymentsComponent } from '../../payments/dialog-create-payments/dialog-create-payments.component'
import { DialogEditPaymentsComponent } from '../../payments/dialog-edit-payments/dialog-edit-payments.component'
import { PaymentModel } from '../../payments/payment.model'
import { PaymentsService } from '../../payments/payments.service'
import { DialogDueData, DialogDuesComponent } from '../../sales/dialog-dues/dialog-dues.component'
import { SaleItemModel } from '../../sales/sale-item.model'
import { SalesService } from '../../sales/sales.service'
import { DialogCreateTurnsComponent } from '../../turns/dialog-create-turns/dialog-create-turns.component'
import { TurnModel } from '../../turns/turn.model'
import { TurnsService } from '../../turns/turns.service'
import { CreditModel } from '../credit.model'
import { CreditsService } from '../credits.service'

@Component({
    selector: 'app-detail-credits',
    imports: [MaterialModule, CommonModule],
    templateUrl: './detail-credits.component.html',
    styleUrls: ['./detail-credits.component.sass']
})
export class DetailCreditsComponent {

    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly authService = inject(AuthService)
    private readonly turnsService = inject(TurnsService)
    private readonly navigationService = inject(NavigationService)
    private readonly creditsService = inject(CreditsService)
    private readonly paymentsService = inject(PaymentsService)
    private readonly salesService = inject(SalesService)
    private readonly duesService = inject(DuesService)

    credit: CreditModel | null = null
    payments: PaymentModel[] = []
    customer: CustomerModel | null = null
    turn: TurnModel | null = null
    saleItems: SaleItemModel[] = []
    office: OfficeModel = new OfficeModel()
    dues: CreateDueModel[] = []
    private creditId: any = 0

    private handleOpenTurn$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleDues$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOpenTurn$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleDues$.unsubscribe()
        this.salesService.setSaleItems([])
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office

            this.handleOpenTurn$ = this.turnsService.handleOpenTurn().subscribe(turn => {
                this.turn = turn
                if (turn === null) {
                    this.matDialog.open(DialogCreateTurnsComponent, {
                        width: '600px',
                        position: { top: '20px' }
                    })
                }
            })
        })

        this.creditId = this.activatedRoute.snapshot.params['creditId']
        this.fetchData()
    }

    onDeletePayment(paymentId: any, saleId: any) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.paymentsService.delete(paymentId, saleId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        }
    }

    onChangeDues() {
        if (this.credit) {
            const data: DialogDueData = {
                turnId: this.credit.turnId,
                charge: this.credit.charge,
                dues: this.dues,
            }

            const dialogRef = this.matDialog.open(DialogDuesComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })

            dialogRef.afterClosed().subscribe(dues => {
                if (dues && dues.length && this.credit) {
                    this.navigationService.loadBarStart()
                    this.duesService.update(dues, this.credit.id).subscribe({
                        next: () => {
                            this.fetchData()
                            this.navigationService.showMessage('Se han guardado los cambios')
                            this.navigationService.loadBarFinish()
                        }, error: (error: HttpErrorResponse) => {
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
            })
        }
    }

    onEditPayment(payment: PaymentModel) {
        const dialogRef = this.matDialog.open(DialogEditPaymentsComponent, {
            data: payment,
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(updatePayment => {
            if (updatePayment) {
                this.navigationService.loadBarStart()
                this.paymentsService.update(updatePayment, payment.id, payment.saleId).subscribe({
                    next: () => {
                        Object.assign(payment, updatePayment)
                        this.navigationService.showMessage('Se han guardado los cambios')
                        this.navigationService.loadBarFinish()
                        this.fetchData()
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.navigationService.loadBarFinish()
                    }
                })
            }
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.creditsService.getCreditById(this.creditId).subscribe(credit => {
            this.navigationService.loadBarFinish()
            this.navigationService.setTitle(`Pagos ${credit.invoicePrefix}${this.office.serialPrefix}-${credit.invoiceNumber}`)
            this.credit = credit
            this.payments = credit.payments
            this.customer = credit.customer
            this.saleItems = credit.saleItems
            this.dues = credit.dues.map(e => ({ charge: e.charge, preCharge: e.charge, dueDate: e.dueDate }))
            this.salesService.setSaleItems(this.saleItems)
        })
    }

    onCreatePayment() {
        if (this.credit && this.turn) {
            const data: DialogCreatePaymentData = {
                turnId: this.turn.id,
                saleId: this.credit.id
            }

            const dialogRef = this.matDialog.open(DialogCreatePaymentsComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })

            dialogRef.afterClosed().subscribe(payment => {
                if (payment && this.credit) {
                    this.navigationService.loadBarStart()
                    this.paymentsService.create(payment, this.credit.id).subscribe({
                        next: () => {
                            this.navigationService.showMessage('Registrado correctamente')
                            this.navigationService.loadBarFinish()
                            this.fetchData()
                        }, error: (error: HttpErrorResponse) => {
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
            })
        }
    }

}
