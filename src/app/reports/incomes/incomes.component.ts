import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentModel } from '../../payments/payment.model';
import { PaymentsService } from '../../payments/payments.service';
import { SummaryPaymentModel } from '../../payments/summary-payment.model';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { MaterialModule } from '../../material.module';
Chart.register(...registerables);

@Component({
    selector: 'app-incomes',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './incomes.component.html',
    styleUrls: ['./incomes.component.sass']
})
export class IncomesComponent implements OnInit {

    constructor(
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly navigationService: NavigationService,
        private readonly paymentsService: PaymentsService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
        paymentMethodId: '',
        userId: '',
        officeId: '',
    })
    users: UserModel[] = []
    payments: PaymentModel[] = []
    offices: OfficeModel[] = []
    office: OfficeModel = new OfficeModel()
    summaryPayments: SummaryPaymentModel[] = []
    paymentMethods: PaymentMethodModel[] = []
    totalCollected: number = 0
    length = 0
    private pageIndex: number = 0
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            Object.assign(this.params, { officeId: this.office._id })
            this.formGroup.patchValue({ officeId: this.office._id })

            const { startDate, endDate } = this.activatedRoute.snapshot.queryParams
            
            if (startDate && endDate) {
                this.formGroup.patchValue({
                    startDate: new Date(Number(startDate)),
                    endDate: new Date(Number(endDate))
                })
            }

            this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
                this.paymentMethods = paymentMethods
                this.fetchData()
                this.fetchCount()
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    this.exportIncomes()
                    break
                }
                default:
                    break
            }
        })
    }

    fetchCount() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            this.paymentsService.getCountPaymentsByRangeDate(startDate, endDate, this.params).subscribe(count => {
                this.length = count
            })
        }
    }

    fetchData() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.paymentsService.getSummaryPaymentsByRangeDate(
                startDate,
                endDate,
                this.params
            ).subscribe(summaryPayments => {
                this.navigationService.loadBarFinish()
                this.summaryPayments = summaryPayments
                this.totalCollected = 0
                for (const summaryPayment of this.summaryPayments) {
                    this.totalCollected += summaryPayment.totalCharge
                }
            })

            this.paymentsService.getPaymentsByRangeDatePage(startDate, endDate, this.pageIndex + 1, 500, this.params).subscribe({
                next: payments => {
                    this.payments = payments
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    exportIncomes() {
        this.navigationService.loadBarStart()
        const { startDate, endDate } = this.formGroup.value
        const chunk = 500
        const promises: Promise<any>[] = []

        for (let index = 0; index < this.length / chunk; index++) {
            const promise = lastValueFrom(this.paymentsService.getPaymentsByRangeDatePageWithSale(startDate, endDate, index + 1, chunk, this.params))
            promises.push(promise)
        }

        Promise.all(promises).then(values => {
            this.navigationService.loadBarFinish()
            const payments = values.flat()
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. DE PAGO',
                'MEDIO DE PAGO',
                'MONTO',
                'COMPROBANTE',
                'USUARIO',
            ])
            for (const payment of payments) {
                body.push([
                    formatDate(payment.createdAt || new Date(), 'dd/MM/yyyy', 'en-US'),
                    (this.paymentMethods.find(e => payment.paymentMethodId === e._id) || { name: '' }).name,
                    payment.charge,
                    `${payment.sale.invoicePrefix}${this.office.serialPrefix}-${payment.sale.invoiceNumber}`,
                    (payment || { name: 'NINGUNO' }).user.name
                ])
            }
            const name = `PAGOS_DESDE_${formatDate(startDate, 'dd-MM-yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd-MM-yyyy', 'en-US')}`
            buildExcel(body, name, wscols, [], [])
        })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0, key: null }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })
            this.fetchData()
            this.fetchCount()
        }
    }

    onPaymentMethodChange() {
        const { paymentMethodId } = this.formGroup.value
        Object.assign(this.params, { paymentMethodId })
        this.fetchData()
        this.fetchCount()
    }

    onPaymentSelected(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onOfficeChange() {
        const { officeId } = this.formGroup.value
        Object.assign(this.params, { officeId })
        this.fetchData()
        this.fetchCount()
    }

    onChangeUser() {
        const { userId } = this.formGroup.value
        Object.assign(this.params, { userId })
        this.fetchData()
        this.fetchCount()
    }

}
