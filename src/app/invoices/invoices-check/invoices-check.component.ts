import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { DialogCreditNotesComponent } from '../../credit-notes/dialog-credit-notes/dialog-credit-notes.component';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PrintService } from '../../print/print.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogRemissionGuidesComponent } from '../../remission-guides/dialog-remission-guides/dialog-remission-guides.component';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ExcelKramvi } from '../ExcelKramvi';
import { CdrModel } from '../cdr.model';
import { DialogDetailSalesComponent } from '../dialog-detail-sales/dialog-detail-sales.component';
import { InvoicesService } from '../invoices.service';
import { SheetExportPdfComponent } from '../sheet-export-pdf/sheet-export-pdf.component';
import { SheetPrintComponent } from '../sheet-print/sheet-print.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-invoices-check',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './invoices-check.component.html',
    styleUrls: ['./invoices-check.component.sass']
})
export class InvoicesCheckComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly invoicesService: InvoicesService,
        private readonly categoriesService: CategoriesService,
        private readonly officesService: OfficesService,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
        private readonly usersService: UsersService,
        private readonly bottomSheet: MatBottomSheet,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        invoiceType: '',
        stateType: '',
        userId: '',
        startDate: [new Date(), Validators.required],
        endDate: [new Date(), Validators.required],
    })
    users: UserModel[] = []
    displayedColumns: string[] = ['checked', 'created', 'serial', 'customer', 'user', 'charge', 'actions']
    dataSource: SaleModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    salesId: string[] = []
    business: BusinessModel = new BusinessModel()
    office: OfficeModel = new OfficeModel()

    private categories: CategoryModel[] = []
    private params: Params = {}
    private startDate: Date = new Date()
    private endDate: Date = new Date()
    private paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Ventas')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        const queryParams = this.activatedRoute.snapshot.queryParams
        const { startDate, endDate, pageIndex, pageSize, invoiceType, stateType } = queryParams
        Object.assign(this.params, queryParams)
        
        this.salesId = []
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.get('invoiceType')?.patchValue(invoiceType || '')
        this.formGroup.get('stateType')?.patchValue(stateType || '')

        if (startDate && endDate) {
            this.startDate = new Date(startDate)
            this.endDate = new Date(endDate)
            this.formGroup.get('startDate')?.patchValue(this.startDate)
            this.formGroup.get('endDate')?.patchValue(this.endDate)
        }

        this.fetchData()
        this.fetchCount()

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'print_massive', label: 'Imprimir', icon: 'printer', show: false },
            { id: 'excel_detail', label: 'Excel detallado', icon: 'file_download', show: false },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByKey(key).subscribe({
                next: sales => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = sales
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'print_massive': {
                    this.printMassive()
                    break
                }
                case 'send_massive': {
                    this.sendMassive()
                    break
                }
                case 'excel_kramvi': {
                    this.excelKramvi()
                    break
                }
                case 'excel_simple': {
                    this.excelSimple()
                    break
                }
                case 'excel_detail': {
                    this.excelDetails()
                    break
                }
                default:
                    break
            }
        })
    }

    checkSaleId(isChecked: boolean, saleId: string) {
        if (isChecked) {
            this.salesId.push(saleId)
        } else {
            const index = this.salesId.indexOf(saleId)
            if (index > -1) {
                this.salesId.splice(index, 1)
            }
        }
    }

    checkAllSales(isChecked: boolean) {
        if (isChecked) {
            this.salesId = []
            this.salesId = this.dataSource.map(e => e._id)
        } else {
            this.salesId = []
        }
    }

    onRemissionGuide(saleId: string) {
        this.matDialog.open(DialogRemissionGuidesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    async sendMassive() {
        if (this.salesId.length) {
            this.navigationService.loadBarStart()
            this.invoicesService.sendInvoiceMassive(this.salesId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Enviado a sunat')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        } else {
            this.navigationService.showMessage('Seleccione un comprobante');
        }
    }

    async printMassive() {
        this.navigationService.loadBarStart()
        for (const saleId of this.salesId) {
            await new Promise((resolve, reject) => {
                this.salesService.getSaleById(saleId).subscribe(sale => {
                    this.printService.printTicket80mm(sale)
                    resolve(true)
                })
            })
        }
        this.navigationService.loadBarFinish()
    }

    invoiceTypes = [
        { code: '', label: 'TODOS LOS COMPROBANTES' },
        { code: 'NOTA DE VENTA', label: 'NOTA DE VENTA' },
        { code: 'BOLETA', label: 'BOLETA' },
        { code: 'FACTURA', label: 'FACTURA' },
        { code: 'BOLETAFACTURA', label: 'BOLETA Y FACTURA' },
    ];

    stateTypes = [
        { code: 'PENDIENTE', label: 'PENDIENTE' },
        { code: 'ANULADO', label: 'ANULADO' },
        { code: 'OBSERVADO', label: 'OBSERVADO' },
    ];

    async excelKramvi() {
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
            const sales: SaleModel[] = []
    
            const offices: OfficeModel[] = await lastValueFrom(this.officesService.getOffices())
    
            offices.sort((a, b) => {
                if (a.serialPrefix > b.serialPrefix) {
                    return 1
                }
                if (a.serialPrefix < b.serialPrefix) {
                    return -1
                }
                return 0
            })
    
            const excelKramvi = new ExcelKramvi(startDate, endDate, this.business)
    
            for (const office of offices) {
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office._id }))
                const chunk = 500
                const dialogRef = this.matDialog.open(DialogProgressComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: length / chunk
                })
    
                for (let index = 0; index < length / chunk; index++) {
                    const values = await lastValueFrom(this.salesService.getSalesByRangeDatePageTax(startDate, endDate, index + 1, chunk, { officeId: office._id }))
                    dialogRef.componentInstance.onComplete()
                    sales.push(...values)
                }
                excelKramvi.addSales(sales, office)
            }
    
            excelKramvi.builExcel()
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    async excelDetails() {
        const { startDate, endDate } = this.formGroup.value
        const chunk = 500
        const sales: SaleModel[] = []

        const dialogRef = this.matDialog.open(DialogProgressComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.length / chunk
        })

        for (let index = 0; index < this.length / chunk; index++) {
            const values = await lastValueFrom(this.salesService.getSalesWithDetailsByRangeDatePage(startDate, endDate, index + 1, chunk, {}))
            dialogRef.componentInstance.onComplete()
            sales.push(...values)
        }

        this.navigationService.loadBarFinish()
        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
        let body = []
        body.push([
            'F. EMISION',
            'RUC/DNI/CE',
            'CLIENTE',
            'DIRECCION',
            'DISTRITO',
            'TELEFONO',
            'COMPROBANTE',
            'Nº COMPROBANTE',
            'PRODUCTO',
            'CATEGORIA',
            'CANTIDAD',
            'PRECIO U.',
            'TOTAL',
            'COSTO U.',
            'UTILIDAD',
            'MONEDA',
            'M. DE PAGO',
            'BONIFICACION',
            'PERSONAL',
            'REFERIDO',
            'USUARIO',
            'ANULADO',
            'OBSERVACIONES'
        ])

        for (const sale of sales) {
            const { customer, saleItems } = sale
            for (const saleItem of saleItems) {
                let paymentNames = '';
                for (const payment of sale.payments) {
                    const foundPaymentMethod = this.paymentMethods.find(e => e._id === payment.paymentMethodId);
                    paymentNames += foundPaymentMethod?.name + ' ';
                }
                body.push([
                    formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                    customer?.document,
                    (customer?.name || 'VARIOS').toUpperCase(),
                    customer?.addresses[0],
                    customer?.locationName,
                    customer?.mobileNumber,
                    sale.invoiceType,
                    `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`,
                    saleItem.fullName.toUpperCase(),
                    this.categories.find(e => e._id === saleItem.categoryId)?.name.toUpperCase(),
                    Number(saleItem.quantity.toFixed(2)),
                    saleItem.price,
                    Number((saleItem.price * saleItem.quantity).toFixed(2)),
                    saleItem.cost || 0,
                    Number(((saleItem.price * saleItem.quantity) - (saleItem.cost || 0 * saleItem.quantity)).toFixed(2)),
                    sale.currencyCode,
                    paymentNames,
                    saleItem.igvCode === '11' ? 'SI' : 'NO',
                    sale.worker ? sale.worker.name.toUpperCase() : null,
                    sale.referred ? sale.referred.name.toUpperCase() : null,
                    sale.user.name.toUpperCase(),
                    sale.deletedAt ? 'SI' : 'NO',
                    sale.observations,
                ]);
            }
        }
        const name = `VENTAS_DESDE_${formatDate(this.startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(this.endDate, 'dd/MM/yyyy', 'en-US')}_${this.office.name.replace(/ /g, '_')}_RUC_${this.business.ruc}`;
        buildExcel(body, name, wscols, []);
    }

    getStatusDeclare(sale: SaleModel): boolean {
        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '0') {
            return false
        }
        if (sale.cdr === null) {
            return false
        }
        if (sale.cdr.sunatCode !== '0') {
            return false
        }
        return true
    }

    getStatus(sale: SaleModel) {
        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '98') {
            return 'PROCESANDO'
        }

        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '0') {
            return 'ANULADO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '2108') {
            return 'RECHAZADO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '98') {
            return 'PROCESANDO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '0') {
            return 'ACEPTADO'
        }

        return 'PENDIENTE'
    }

    async excelSimple() {
        const chunk = 500
        const sales: SaleModel[] = []

        const dialogRef = this.matDialog.open(DialogProgressComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.length / chunk
        })

        for (let index = 0; index < this.length / chunk; index++) {
            const values = await lastValueFrom(this.salesService.getSalesByPage(index + 1, chunk, this.params))
            dialogRef.componentInstance.onComplete()
            sales.push(...values)
        }

        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
        let body = [];
        body.push([
            'F. EMISION',
            'H. EMISION',
            'RUC/DNI',
            'CLIENTE',
            'DIRECCION',
            'DISTRITO',
            'CELULAR',
            'Nº COMPROBANTE',
            'IMPORTE T.',
            // 'M. PAGADO',
            'ENTREGA',
            'USUARIO',
            'PERSONAL',
            'REFERENCIA',
            'OBSERVACIONES',
            'ANULADO'
        ])
        for (const sale of sales) {
            const { customer, user } = sale
            body.push([
                formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                formatDate(sale.createdAt, 'h:mm', 'en-US'),
                customer?.document,
                customer?.name,
                customer?.addresses[0],
                customer?.locationName,
                customer?.mobileNumber,
                `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`,
                sale.charge,
                // sale.payments.filter(e => !e.deletedAt).reduce((a, b) => a + b.charge, 0),
                user.name,
                sale.worker?.name.toUpperCase(),
                sale.referred?.name.toUpperCase(),
                sale.observations,
                sale.deletedAt ? 'SI' : 'NO'
            ]);
        }
        const name = `VENTAS`
        buildExcel(body, name, wscols, [], [])
    }

    onClickOptions(event: MouseEvent, saleId: string) {
        // if (event.ctrlKey && this.user.isAdmin) {
        //   event.stopPropagation();
        //   const dialogRef = this.matDialog.open(DialogAdminComponent, {
        //     width: '600px',
        //     position: { top: '20px' },
        //     data: saleId,
        //   });

        //   dialogRef.componentInstance.onUpdate.subscribe(() => {
        //     this.fetchData();
        //   }); 
        // }
    }

    downloadFile(cdr: CdrModel) {
        // const linkSource = cdr.base64Xml;
        // const downloadLink = document.createElement("a");
        // const fileName = `${this.business.ruc}-${cdr.sale?.invoiceCode}-${cdr.sale?.invoicePrefix}${this.office.serialPrefix}-${cdr?.sale?.invoiceNumber}.zip`;

        // downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        // downloadLink.click();
    }

    onCreditNoteDialog(saleId: string) {
        this.matDialog.open(DialogCreditNotesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onRemissionGuideDialog(saleId: string) {
        this.matDialog.open(DialogRemissionGuidesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onInvoiceChange(invoiceType: string) {
        this.pageIndex = 0
        const queryParams: Params = { invoiceType }

        this.params = queryParams

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onStateChange(stateType: string) {
        const queryParams: Params = { stateType }

        this.params = queryParams

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onUserChange(userId: string) {
        this.pageIndex = 0;
        const queryParams: Params = { userId }

        this.params = queryParams;

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

    onRangeChange() {
        if (this.formGroup.valid) {
            this.pageIndex = 0

            const { startDate, endDate } = this.formGroup.value

            this.startDate = startDate
            this.endDate = endDate

            const queryParams: Params = { startDate: startDate.getTime(), endDate: endDate.getTime(), pageIndex: 0 }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchCount()
            this.fetchData()
        }
    }

    fetchCount() {
        this.salesService.getCountSales(this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByPage(
                this.pageIndex + 1,
                this.pageSize,
                this.params
            ).subscribe(sales => {
                this.dataSource = sales
                this.navigationService.loadBarFinish()
            })
        }
    }

    onOpenDetails(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onPrint(saleId: string) {
        this.bottomSheet.open(SheetPrintComponent, { data: saleId })
    }

    onExportPdf(saleId: string) {
        this.bottomSheet.open(SheetExportPdfComponent, { data: saleId })
    }

    onSendInvoice(saleId: string) {
        this.navigationService.loadBarStart()
        this.invoicesService.sendInvoice(saleId).subscribe({
            next: cdr => {
                this.fetchData()
                this.navigationService.showMessage('Enviado a sunat')
                this.navigationService.loadBarFinish()
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.navigationService.loadBarFinish()
            }
        })
    }

}
