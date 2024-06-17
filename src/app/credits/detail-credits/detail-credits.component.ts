import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { CustomerModel } from '../../customers/customer.model';
import { CreateDueModel } from '../../dues/create-due.model';
import { DuesService } from '../../dues/dues.service';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogEditPaymentsComponent } from '../../payments/dialog-edit-payments/dialog-edit-payments.component';
import { PaymentModel } from '../../payments/payment.model';
import { PaymentsService } from '../../payments/payments.service';
import { DialogDueData, DialogDuesComponent } from '../../sales/dialog-dues/dialog-dues.component';
import { SaleItemModel } from '../../sales/sale-item.model';
import { SalesService } from '../../sales/sales.service';
import { DialogTurnsComponent } from '../../turns/dialog-turns/dialog-turns.component';
import { TurnModel } from '../../turns/turn.model';
import { TurnsService } from '../../turns/turns.service';
import { CreditModel } from '../credit.model';
import { CreditsService } from '../credits.service';
import { DialogPaymentComponent, DialogPaymentData } from '../dialog-payment/dialog-payment.component';

@Component({
    selector: 'app-detail-credits',
    templateUrl: './detail-credits.component.html',
    styleUrls: ['./detail-credits.component.sass']
})
export class DetailCreditsComponent implements OnInit {

    constructor(
        private readonly authService: AuthService,
        private readonly turnsService: TurnsService,
        private readonly navigationService: NavigationService,
        private readonly creditsService: CreditsService,
        private readonly paymentsService: PaymentsService,
        private readonly salesService: SalesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly duesService: DuesService,
    ) { }

    credit: CreditModel | null = null
    payments: PaymentModel[] = []
    customer: CustomerModel | null = null
    turn: TurnModel | null = null
    saleItems: SaleItemModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()
    dues: CreateDueModel[] = []
    private creditId: string = ''

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
        })

        this.creditId = this.activatedRoute.snapshot.params['creditId']
        this.fetchData()
    }

    onDeletePayment(paymentId: string, saleId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.paymentsService.delete(paymentId, saleId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
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
                    this.duesService.update(dues, this.credit._id).subscribe({
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
                this.paymentsService.update(updatePayment, payment._id, payment.saleId).subscribe({
                    next: () => {
                        Object.assign(payment, updatePayment)
                        this.navigationService.showMessage('Se han guardado los cambios')
                        this.navigationService.loadBarFinish()
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

    onAddPayment() {
        if (this.credit && this.turn) {
            const data: DialogPaymentData = {
                turnId: this.turn._id,
                saleId: this.credit._id
            }

            const dialogRef = this.matDialog.open(DialogPaymentComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })

            dialogRef.afterClosed().subscribe(payment => {
                if (payment && this.credit) {
                    this.navigationService.loadBarStart()
                    this.paymentsService.create(payment, this.credit._id).subscribe({
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
