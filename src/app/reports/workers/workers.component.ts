import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogDetailSaleItemsComponent } from '../../sales/dialog-detail-sale-items/dialog-detail-sale-items.component';
import { WorkerModel } from '../../workers/worker.model';
import { WorkersService } from '../../workers/workers.service';

@Component({
    selector: 'app-workers',
    templateUrl: './workers.component.html',
    styleUrls: ['./workers.component.sass']
})
export class WorkersComponent implements OnInit {

    constructor(
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly workersService: WorkersService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    officeId: string = ''
    workers: WorkerModel[] = []
    worker: WorkerModel | null = null
    workerId: string = ''
    offices: OfficeModel[] = []
    office: OfficeModel = new OfficeModel()
    summary: any[] = []
    dataSource: any[] = []
    displayedColumns: string[] = ['product', 'totalQuantity', 'totalQuantityBonus', 'totalSale', 'actions']
    summaries: any[] = []
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$eAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleWorkers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$eAuth$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleWorkers$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setMenu([
            { id: 'download_excel', label: 'Exportar Excel', icon: '', show: false },
        ])

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })

        this.handleWorkers$ = this.workersService.handleWorkers().subscribe(workers => {
            this.workers = workers
        })

        this.handleAuth$eAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.officeId = this.office._id
            Object.assign(this.params, { officeId: this.officeId })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'download_excel': {
                    const { startDate, endDate } = this.formGroup.value
                    this.navigationService.loadBarStart()
                    this.workersService.getSummaryWorkersComplete(startDate, endDate).subscribe(summaryWorkers => {
                        console.log(summaryWorkers)
                        this.navigationService.loadBarFinish()
                        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                        let body = []
                        body.push([
                            'PERSONAL',
                            'PRODUCTO',
                            'C. INTERNO',
                            'C. FABRICANTE',
                            'CANTIDAD',
                            'MONTO'
                        ])
                        for (const summaryWorker of summaryWorkers) {
                            body.push([
                                summaryWorker.worker.name.toUpperCase(),
                                summaryWorker.product.name.toUpperCase(),
                                summaryWorker.product.sku,
                                summaryWorker.product.upc,
                                summaryWorker.totalQuantity,
                                Number(summaryWorker.totalSale.toFixed(2))
                            ])
                        }
                        const name = `RESUMEN_DE_PERSONAL`
                        buildExcel(body, name, wscols, [], [])
                    })
                    break
                }
                default:
                    break
            }
        })

        const { startDate, endDate } = this.activatedRoute.snapshot.queryParams

        if (startDate && endDate) {
            this.formGroup.get('startDate')?.patchValue(new Date(Number(startDate)))
            this.formGroup.get('endDate')?.patchValue(new Date(Number(endDate)))
        }

        this.fetchData()
    }

    onDialogDetailSaleItems(saleItemIds: string[]) {
        this.matDialog.open(DialogDetailSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleItemIds
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.workersService.getSummaryWorkers(startDate, endDate, this.params).subscribe(summaries => {
                this.navigationService.loadBarFinish()
                this.summaries = summaries
            })
        }
    }

    chargeTotal(saleItems: any[]) {
        return saleItems.map((e: any) => e.totalCharge).reduce((a, b) => a + b, 0)
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime() }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })
            this.fetchData()
        }
    }

    onOfficeChange() {
        Object.assign(this.params, { officeId: this.officeId })
        this.fetchData()
    }

}
