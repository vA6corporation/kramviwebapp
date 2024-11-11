import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { SaleItemModel } from '../../sales/sale-item.model';
import { SalesService } from '../../sales/sales.service';
import { CustomersService } from '../customers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, lastValueFrom } from 'rxjs';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { CustomerModel } from '../customer.model';
import { buildExcel } from '../../buildExcel';
import { CommonModule, formatDate } from '@angular/common';
import { OfficeModel } from '../../auth/office.model';
import { AuthService } from '../../auth/auth.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sale-customers',
    standalone: true,
    imports: [MaterialModule, CommonModule, ReactiveFormsModule],
    templateUrl: './sale-customers.component.html',
    styleUrls: ['./sale-customers.component.sass']
})
export class SaleCustomersComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly customersService: CustomersService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly matDialog: MatDialog
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    displayedColumns: string[] = ['createdAt', 'product', 'quantity', 'price', 'total', 'invoice', 'actions']
    dataSource: SaleItemModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    office: OfficeModel = new OfficeModel()
    private customerId: string = ''
    private customer: CustomerModel | null = null
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.customerId = this.activatedRoute.snapshot.params['customerId']
        const { startDate, endDate } = this.activatedRoute.snapshot.queryParams

        if (startDate && endDate) {
            this.formGroup.patchValue({ 
                startDate: new Date(startDate), 
                endDate: new Date(endDate), 
            })
            Object.assign(this.params, { startDate, endDate })
        }

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'file_download', show: false },
        ])
        
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            const saleItems = []
            const chunk = 500
            const dialogRef = this.matDialog.open(DialogProgressComponent, {
                width: '600px',
                position: { top: '20px' },
                data: length / chunk
            })

            for (let index = 0; index < length / chunk; index++) {
                const values = await lastValueFrom(this.salesService.getSaleItemsByCustomerPage(this.customerId, this.pageIndex + 1, chunk, this.params))
                dialogRef.componentInstance.onComplete()
                saleItems.push(...values)
            }

            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. VENTA',
                'PRODUCTO',
                'CANTIDAD',
                'P. UNITARIO',
                'TOTAL',
                'COMPROBANTE',
            ])
            for (const saleItem of saleItems) {
                body.push([
                    formatDate(new Date(saleItem.createdAt), 'dd/MM/yyyy', 'en-US'),
                    saleItem.fullName.toUpperCase(),
                    saleItem.quantity,
                    Number(saleItem.price.toFixed(2)),
                    Number((saleItem.price * saleItem.quantity).toFixed(2)),
                    `${saleItem.sale?.invoicePrefix}${this.office.serialPrefix}-${saleItem.sale?.invoiceNumber}`
                ])
            }
            const name = `VENTAS_${this.customer?.name.replace(/ /g, '_')}`
            buildExcel(body, name, wscols, [])
        })

        this.customersService.getCustomerById(this.customerId).subscribe(customer => {
            this.customer = customer
            this.navigationService.setTitle(`Historial de ventas ${customer.name}`)
        })
        this.fetchData()
        this.fetchCount()
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value

            Object.assign(this.params, { startDate, endDate })

            const queryParams: Params = { startDate: startDate, endDate: endDate, pageIndex: 0 }


            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchCount()
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

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    fetchCount() {
        this.salesService.countSaleItemsByCustomer(this.customerId, this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.salesService.getSaleItemsByCustomerPage(this.customerId, this.pageIndex + 1, this.pageSize, this.params).subscribe(saleItems => {
            this.navigationService.loadBarFinish()
            this.dataSource = saleItems
        })
    }

}
