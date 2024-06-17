import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { PaymentOrderModel } from '../payment-order.model';
import { PaymentOrdersService } from '../payment-orders.service';
import { DialogPdfComponent } from '../dialog-pdf/dialog-pdf.component';

@Component({
    selector: 'app-payment-orders',
    templateUrl: './payment-orders.component.html',
    styleUrls: ['./payment-orders.component.sass']
})
export class PaymentOrdersComponent implements OnInit {

    constructor(
        private readonly paymentOrdersService: PaymentOrdersService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly printService: PrintService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
    ) { }

    displayedColumns: string[] = ['paymentOrderNumber', 'serie', 'concept', 'provider', 'charge', 'paymentAt', 'observations', 'actions']
    dataSource: PaymentOrderModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    private business: BusinessModel = new BusinessModel()

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Ordenes de pago')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'export_excel', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        const { startDate, endDate, pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams

        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)

        if (startDate && endDate) {
            this.formGroup.get('startDate')?.patchValue(new Date(Number(startDate)))
            this.formGroup.get('endDate')?.patchValue(new Date(Number(endDate)))
        }

        this.paymentOrdersService.getCountPaymentOrdersByRangeDate(this.formGroup.value.startDate, this.formGroup.value.endDate).subscribe(count => {
            this.length = count
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
        })

        this.fetchData()

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    this.navigationService.loadBarStart()
                    const { startDate, endDate } = this.formGroup.value
                    this.paymentOrdersService.getPaymentOrdersByRangeDate(startDate, endDate).subscribe(paymentOrders => {
                        this.navigationService.loadBarFinish()
                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                        let body = []
                        body.push([
                            'DESCRIPCION',
                            'M. DE PAGO',
                            'IMPORTE',
                            'SERIE',
                            'OBSERVACIONES',
                            'FECHA DE PAGO',
                            'N° DE OPERACION',
                            'PAGADO',
                        ])
                        for (const paymentOrder of paymentOrders) {
                            body.push([
                                paymentOrder.concept.toUpperCase(),
                                paymentOrder.paymentType,
                                paymentOrder.charge,
                                paymentOrder.serie,
                                (paymentOrder.observations || '').toUpperCase(),
                                formatDate(new Date(paymentOrder.paymentAt), 'dd/MM/yyyy', 'en-US'),
                                paymentOrder.operationNumber,
                                paymentOrder.isPaid ? 'SI' : 'NO',
                            ])
                        }
                        const name = `ORDENES_DE_PAGO_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.business.businessName.replace(/ /g, '_')}`
                        buildExcel(body, name, wscols, [])
                    }, (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                    })
                }
            }
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.paymentOrdersService.getPaymentOrdersByKey(key).subscribe({
                next: paymentOrders => {
                    this.dataSource = paymentOrders
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    onShowPdf(paymentOrder: PaymentOrderModel) {
        const dialogRefPDf = this.matDialog.open(DialogPdfComponent, {
            width: '95vw',
            height: '90vh',
            position: { top: '20px' },
            data: paymentOrder.urlPdf
        })

        dialogRefPDf.componentInstance.handleDeletePdf().subscribe(() => {
            this.navigationService.loadBarStart()
            this.paymentOrdersService.deleteFile(paymentOrder._id).subscribe(() => {
                this.navigationService.loadBarFinish()
                paymentOrder.urlPdf = ''
            })
        })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0
            const { startDate, endDate } = this.formGroup.value

            this.paymentOrdersService.getCountPaymentOrdersByRangeDate(startDate, endDate).subscribe(count => {
                this.length = count
            })

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0 }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
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

    fetchData() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.paymentOrdersService.getPaymentOrdersByRangeDatePage(startDate, endDate, this.pageIndex + 1, this.pageSize).subscribe(paymentOrders => {
                this.navigationService.loadBarFinish()
                this.dataSource = paymentOrders
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

    onPrint(paymentOrderId: string) {
        this.navigationService.loadBarStart()
        this.paymentOrdersService.getPaymentOrderById(paymentOrderId).subscribe(paymentOrder => {
            this.navigationService.loadBarFinish()
            this.printService.printPaymentOrderA4(paymentOrder)
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onExportPdf(paymentOrderId: string) {
        this.navigationService.loadBarStart()
        this.paymentOrdersService.getPaymentOrderById(paymentOrderId).subscribe(paymentOrder => {
            this.navigationService.loadBarFinish()
            this.printService.exportPaymentOrderA4(paymentOrder)
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })
    }

    onDelete(providerId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.paymentOrdersService.delete(providerId).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            }, (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

}
