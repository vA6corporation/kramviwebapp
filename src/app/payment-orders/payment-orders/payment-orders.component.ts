import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { PaymentOrderModel } from '../payment-order.model';
import { PaymentOrdersService } from '../payment-orders.service';
import { DialogPdfComponent } from '../dialog-pdf/dialog-pdf.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-payment-orders',
    standalone: true,
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
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
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    private business: BusinessModel = new BusinessModel()
    private params: Params = {}

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
            this.formGroup.patchValue({ startDate: new Date(Number(startDate)) })
            this.formGroup.patchValue({ endDate: new Date(Number(endDate)) })
        }

        this.fetchData()
        this.fetchCount()

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'export_excel': {
                    const { startDate, endDate } = this.formGroup.value
                    if (startDate && endDate) {
                        this.navigationService.loadBarStart()
                        this.paymentOrdersService.getPaymentOrdersByRangeDate(startDate, endDate, this.params).subscribe({
                            next: paymentOrders => {
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
                                        paymentOrder.paymentMethod.name,
                                        paymentOrder.charge,
                                        paymentOrder.serie,
                                        (paymentOrder.observations || '').toUpperCase(),
                                        formatDate(paymentOrder.paymentAt, 'dd/MM/yyyy', 'en-US'),
                                        paymentOrder.operationNumber,
                                        paymentOrder.isPaid ? 'SI' : 'NO',
                                    ])
                                }
                                const name = `ORDENES_DE_PAGO_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.business.businessName.replace(/ /g, '_')}`
                                buildExcel(body, name, wscols, [])
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    } else {
                        this.navigationService.showMessage('Seleccione un rango de fechas')
                    }
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
            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0 }
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

    fetchCount() {
        this.paymentOrdersService.getCountPaymentOrders(this.params).subscribe(count => {
            this.length = count
        }, (error: HttpErrorResponse) => {
            this.navigationService.showMessage(error.error.message)
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.paymentOrdersService.getPaymentOrdersByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
            next: paymentOrders => {
                this.navigationService.loadBarFinish()
                this.dataSource = paymentOrders
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onPrint(paymentOrderId: string) {
        this.navigationService.loadBarStart()
        this.paymentOrdersService.getPaymentOrderById(paymentOrderId).subscribe({
            next: paymentOrder => {
                this.navigationService.loadBarFinish()
                this.printService.printPaymentOrderA4(paymentOrder)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onExportPdf(paymentOrderId: string) {
        this.navigationService.loadBarStart()
        this.paymentOrdersService.getPaymentOrderById(paymentOrderId).subscribe({
            next: paymentOrder => {
                this.navigationService.loadBarFinish()
                this.printService.exportPaymentOrderA4(paymentOrder)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onDelete(providerId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.paymentOrdersService.delete(providerId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Eliminado correctamente')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
