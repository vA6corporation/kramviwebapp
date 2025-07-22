import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { DialogPasswordComponent } from '../../boards/dialog-password/dialog-password.component';
import { buildExcel } from '../../buildExcel';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PrintService } from '../../print/print.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { InvoiceType } from '../../sales/invoice-type.enum';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { ExcelConcar } from '../ExcelConcar';
import { ExcelKramvi } from '../ExcelKramvi';
import { DialogAdminComponent, DialogAdminData } from '../dialog-admin/dialog-admin.component';
import { DialogBadCdrsComponent } from '../dialog-bad-cdrs/dialog-bad-cdrs.component';
import { DialogCheckCdrsComponent } from '../dialog-check-cdrs/dialog-check-cdrs.component';
import { DialogDeleteSaleComponent } from '../dialog-delete-sale/dialog-delete-sale.component';
import { DialogDetailSalesComponent } from '../dialog-detail-sales/dialog-detail-sales.component';
import { InvoicesService } from '../invoices.service';
import { SheetExportPdfComponent } from '../sheet-export-pdf/sheet-export-pdf.component';
import { SheetInvoicesComponent } from '../sheet-invoices/sheet-invoices.component';
import { SheetPrintComponent } from '../sheet-print/sheet-print.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-invoices',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent {

    constructor(
        private readonly salesService: SalesService,
        private readonly categoriesService: CategoriesService,
        private readonly invoicesService: InvoicesService,
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
        officeId: '',
        invoiceType: '',
        stateType: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    users: UserModel[] = []
    displayedColumns: string[] = ['checked', 'created', 'serial', 'customer', 'user', 'charge', 'observations', 'actions']
    dataSource: SaleModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    saleIds: string[] = []
    business: BusinessModel = new BusinessModel()
    office: OfficeModel = new OfficeModel()
    offices: OfficeModel[] = []
    officeId: string = ''
    year: number = new Date().getFullYear()
    monthIndex: number = new Date().getMonth()
    years: number[] = []
    months: any[] = [
        { index: 0, label: 'ENERO' },
        { index: 1, label: 'FEBRERO' },
        { index: 2, label: 'MARZO' },
        { index: 3, label: 'ABRIL' },
        { index: 4, label: 'MAYO' },
        { index: 5, label: 'JUNIO' },
        { index: 6, label: 'JULIO' },
        { index: 7, label: 'AGOSTO' },
        { index: 8, label: 'SEPTIEMBRE' },
        { index: 9, label: 'OCTUBRE' },
        { index: 10, label: 'NOVIEMBRE' },
        { index: 11, label: 'DICIEMBRE' },
    ]

    private setting: SettingModel = new SettingModel()

    private categories: CategoryModel[] = []
    private params: Params = {}
    private key: string = ''
    private paymentMethods: PaymentMethodModel[] = []

    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleWorkers: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handlePaymentMethods$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleWorkers.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handlePaymentMethods$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Comprobantes')

        const startYear = 2020
        const currentYear = new Date().getFullYear()

        for (let index = startYear; index <= currentYear; index++) {
            this.years.push(index)
        }

        this.invoicesService.getBadCdrs().subscribe(badCdrs => {
            if (badCdrs.length) {
                this.matDialog.open(DialogBadCdrsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: badCdrs
                })
            }
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
            this.setting = auth.setting

            Object.assign(this.params, { officeId: this.office._id })
            this.formGroup.patchValue({ officeId: this.office._id })

            const queryParams = this.activatedRoute.snapshot.queryParams
            const { startDate, endDate, pageIndex, pageSize, invoiceType, stateType, userId, key, officeId } = queryParams

            this.saleIds = []
            this.pageIndex = Number(pageIndex || 0)
            this.pageSize = Number(pageSize || 10)
            this.key = key

            if (startDate && endDate) {
                this.formGroup.patchValue({ 
                    startDate: new Date(startDate), 
                    endDate: new Date(endDate) 
                })
                Object.assign(this.params, { 
                    startDate: new Date(startDate), 
                    endDate: new Date(endDate)
                })
            }

            Object.assign(this.params, { officeId: officeId || this.office._id })

            this.formGroup.patchValue({
                invoiceType: invoiceType || '',
                stateType: stateType || '',
                userId: userId || '',
                officeId: officeId || this.office._id,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            })

            this.fetchData()
            this.fetchCount()
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'send_massive', label: 'Enviar a Sunat', icon: 'near_me', show: false },
            { id: 'copy_invoices', label: 'Copiar ventas', icon: 'content_copy', show: false },
            { id: 'new_invoice', label: 'Nueva venta desde', icon: 'content_copy', show: false },
            { id: 'check_cdrs', label: 'Consultar CDRS', icon: 'check', show: false },
            { id: 'print_massive', label: 'Imprimir', icon: 'printer', show: false },
            { id: 'excel_simple', label: 'Excel simple', icon: 'file_download', show: false },
            { id: 'excel_detail', label: 'Excel detallado', icon: 'file_download', show: false },
            { id: 'excel_kramvi', label: 'Excel contabilidad', icon: 'file_download', show: false },
            { id: 'excel_concar', label: 'Excel concar', icon: 'file_download', show: false },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.saleIds = []
            this.pageIndex = 0
            this.length = 0

            this.key = key
            const queryParams: Params = { key, tabIndex: 0, startDate: null, endDate: null }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

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
                case 'new_invoice': {
                    this.newInvoice()
                    break
                }
                case 'copy_invoices': {
                    this.copyMassive()
                    break
                }
                case 'print_massive': {
                    this.printMassive()
                    break
                }
                case 'send_massive': {
                    this.sendMassive()
                    break
                }
                case 'excel_concar': {
                    this.excelConcar()
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
                case 'check_cdrs': {
                    this.checkCdrs()
                    break
                }
                default:
                    break
            }
        })
    }

    onYearChange() {
        const queryParams: Params = { year: this.year }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        const startDate = new Date(this.year, this.monthIndex, 1)
        const endDate = new Date(this.year, this.monthIndex + 1, 0)

        Object.assign(this.params, { startDate, endDate })

        this.formGroup.patchValue({
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        })

        this.fetchData()
        this.fetchCount()
    }

    onMonthChange() {
        const queryParams: Params = { monthIndex: this.monthIndex }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        const startDate = new Date(this.year, this.monthIndex, 1)
        const endDate = new Date(this.year, this.monthIndex + 1, 0)

        Object.assign(this.params, { startDate, endDate })

        this.formGroup.patchValue({
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        })

        this.fetchData()
        this.fetchCount()
    }

    checkCdrs() {
        if (this.saleIds.length === 0) {
            this.navigationService.showMessage('Seleccione almenos un comprobante')
        } else {
            this.matDialog.open(DialogCheckCdrsComponent, {
                width: '900px',
                position: { top: '20px' },
                disableClose: true,
                data: this.saleIds,
            })
        }
    }

    async copyMassive() {
        if (this.saleIds.length) {
            const ok = confirm('Esta seguro de realizar las copias?...')
            if (ok) {
                this.navigationService.loadBarStart()
                this.invoicesService.copyInvoiceMassive(this.saleIds).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Copias generadas')
                        this.fetchData()
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.navigationService.loadBarFinish()
                    }
                })
            }
        } else {
            this.navigationService.showMessage('Seleccione un comprobante')
        }
    }

    async newInvoice() {
        if (this.saleIds.length) {
            const queryParams: Params = { saleIds: this.saleIds }
            this.router.navigate(['/charge/from'], { queryParams })
        } else {
            this.navigationService.showMessage('Seleccione un comprobante')
        }
    }

    onOptions(saleId: string) {
        const bottomSheetRef = this.bottomSheet.open(SheetInvoicesComponent, { data: saleId })
        bottomSheetRef.instance.handleSendInvoice().subscribe(() => {
            this.fetchData()
        })
    }

    onEditSale(sale: SaleModel) {
        if (this.setting.password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    if (sale.isBiller) {
                        this.router.navigate(['/biller', sale._id, 'edit'])
                    } else {
                        this.router.navigate(['/posStandard', sale._id, 'edit'])
                    }
                }
            })
        } else {
            if (sale.isBiller) {
                this.router.navigate(['/biller', sale._id, 'edit'])
            } else {
                this.router.navigate(['/posStandard', sale._id, 'edit'])
            }
        }
    }

    async excelConcar() {
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
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

            const excelConcar = new ExcelConcar(startDate, endDate, offices, this.business)

            for (const office of offices) {
                const sales: SaleModel[] = []
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office._id }))
                if (length) {
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
                    excelConcar.addSales(sales, office)
                }
            }

            excelConcar.builExcel()
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    checkSaleId(isChecked: boolean, saleId: string) {
        if (isChecked) {
            this.saleIds.push(saleId)
        } else {
            const index = this.saleIds.indexOf(saleId)
            if (index > -1) {
                this.saleIds.splice(index, 1)
            }
        }
    }

    checkAllSales(isChecked: boolean) {
        if (isChecked) {
            this.saleIds = []
            this.saleIds = this.dataSource.map(e => e._id)
        } else {
            this.saleIds = []
        }
    }

    async sendMassive() {
        if (this.saleIds.length) {
            this.navigationService.loadBarStart()
            this.invoicesService.sendInvoiceMassive(this.saleIds).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Enviado a sunat')
                    this.fetchData()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        } else {
            let ok = confirm('Solo se enviaran hasta maximo 500 boletas, esto puede demorar hasta 20 min')
            if (ok) {
                this.navigationService.loadBarStart()
                this.invoicesService.sendInvoiceMassive(this.saleIds).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Enviando a sunat')
                        this.fetchData()
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.showMessage(error.error.message)
                        this.navigationService.loadBarFinish()
                    }
                })
            }
        }
    }

    async printMassive() {
        this.navigationService.loadBarStart()
        for (const saleId of this.saleIds) {
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
    ]

    stateTypes = [
        { code: 'PENDIENTE', label: 'PENDIENTE' },
        { code: 'ANULADO', label: 'ANULADO' },
        { code: 'OBSERVADO', label: 'OBSERVADO' },
    ]

    async excelKramvi() {
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
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
                const sales: SaleModel[] = []
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office._id }))
                if (length) {
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
            }

            excelKramvi.builExcel()
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    async excelDetails() {
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
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
                    let paymentNames = ''
                    for (const payment of sale.payments) {
                        const foundPaymentMethod = this.paymentMethods.find(e => e._id === payment.paymentMethodId)
                        paymentNames += foundPaymentMethod?.name + ' '
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
                        Number(saleItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        saleItem.price,
                        Number((saleItem.price * saleItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        saleItem.cost || 0,
                        Number(((saleItem.price * saleItem.quantity) - (saleItem.cost || 0 * saleItem.quantity)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                        sale.currencyCode,
                        paymentNames,
                        saleItem.igvCode === '11' ? 'SI' : 'NO',
                        sale.worker ? sale.worker.name.toUpperCase() : null,
                        sale.referred ? sale.referred.name.toUpperCase() : null,
                        sale.user.name.toUpperCase(),
                        sale.deletedAt ? 'SI' : 'NO',
                        sale.observations,
                    ])
                }
            }
            const name = `VENTAS_DESDE_${formatDate(startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(endDate, 'dd/MM/yyyy', 'en-US')}_${this.office.name.replace(/ /g, '_')}_RUC_${this.business.ruc}`
            buildExcel(body, name, wscols, [])
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
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
        const { startDate, endDate } = this.formGroup.value
        if (startDate && endDate) {
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
                    user.name,
                    sale.worker?.name.toUpperCase(),
                    sale.referred?.name.toUpperCase(),
                    sale.observations,
                    sale.deletedAt ? 'SI' : 'NO'
                ])
            }
            const name = `VENTAS_${this.office.name.toUpperCase().replace(/ /g, '_')}`
            buildExcel(body, name, wscols, [], [])
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    onClickOptions(event: MouseEvent, saleId: string) {
        if (event.ctrlKey) {
            const data: DialogAdminData = {
                saleId,
                saleIds: this.saleIds
            }

            event.stopPropagation()
            const dialogRef = this.matDialog.open(DialogAdminComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })

            dialogRef.componentInstance.handleUpdate().subscribe(() => {
                this.fetchData()
            })
        }
    }

    onInvoiceChange(invoiceType: string) {
        this.key = ''
        this.pageIndex = 0
        const queryParams: Params = { invoiceType, key: null }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onStateChange(stateType: string) {
        this.key = ''
        this.pageIndex = 0
        const queryParams: Params = { stateType, key: null }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onOfficeChange(officeId: string) {
        this.key = ''
        this.pageIndex = 0
        const queryParams: Params = { officeId, key: null }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onUserChange(userId: string) {
        this.key = ''
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

            this.key = ''

            Object.assign(this.params, { startDate, endDate })

            const queryParams: Params = { startDate, endDate, pageIndex: 0, key: null }

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
        this.saleIds = []
        if (this.key) {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByKey(this.key).subscribe({
                next: sales => {
                    this.dataSource = sales
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        } else {
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

    onDeleteInvoice(sale: SaleModel) {
        if (this.business.certificateId && sale.cdr === null && sale.invoiceType !== InvoiceType.NOTA_DE_VENTA) {
            this.navigationService.loadBarStart()
            this.invoicesService.sendInvoice(sale._id).subscribe({
                next: cdr => {
                    sale.cdr = cdr
                    this.navigationService.loadBarFinish()
                    this.onDeleteInvoice(sale)
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
            return
        }

        if (this.setting.password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    if (sale.invoiceType === InvoiceType.NOTA_DE_VENTA) {
                        const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(deletedReason => {
                            if (deletedReason) {
                                this.navigationService.loadBarStart()
                                this.invoicesService.softDeleteInvoice(sale._id, deletedReason).subscribe(() => {
                                    this.fetchData()
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage('Comprobante anulado')
                                })
                            } else {
                                this.navigationService.showMessage('Debe indicar el motivo')
                            }
                        })
                    } else {
                        const today = new Date()
                        const saleDate = new Date(sale.createdAt)

                        const diffTime = Math.abs(today.getTime() - saleDate.getTime())
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                        if (diffDays > 4 && sale.deletedAt === null) {
                            alert('Debera generar una nota de credito para anular este comprobante')
                        } else {
                            const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                                width: '600px',
                                position: { top: '20px' },
                            })

                            dialogRef.afterClosed().subscribe(deletedReason => {
                                if (deletedReason) {
                                    this.navigationService.loadBarStart()
                                    if (this.business.certificateId) {
                                        this.invoicesService.cancelInvoice(sale._id, deletedReason).subscribe({
                                            next: () => {
                                                this.fetchData()
                                                this.navigationService.loadBarFinish()
                                                this.navigationService.showMessage('Comprobante anulado')
                                            }, error: (error: HttpErrorResponse) => {
                                                this.navigationService.loadBarFinish()
                                                this.navigationService.showMessage(error.error.message)
                                            }
                                        })
                                    } else {
                                        this.invoicesService.softDeleteInvoice(sale._id, deletedReason).subscribe(() => {
                                            this.fetchData()
                                            this.navigationService.loadBarFinish()
                                            this.navigationService.showMessage('Comprobante anulado')
                                        })
                                    }
                                } else {
                                    this.navigationService.showMessage('Debe indicar el motivo')
                                }
                            })
                        }
                    }
                }
            })
            return
        }

        if (sale.invoiceType === 'NOTA DE VENTA') {
            const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(deletedReason => {
                if (deletedReason) {
                    this.navigationService.loadBarStart()
                    this.invoicesService.softDeleteInvoice(sale._id, deletedReason).subscribe(() => {
                        this.fetchData()
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Comprobante anulado')
                    })
                } else {
                    this.navigationService.showMessage('Debe indicar el motivo')
                }
            })
        } else if (this.business.certificateId) {
            const today = new Date()
            const saleDate = new Date(sale.createdAt)

            const diffTime = Math.abs(today.getTime() - saleDate.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays > 4 && sale.deletedAt === null) {
                alert('Debera generar una nota de credito para anular esta comprobante')
            } else {
                const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                    width: '600px',
                    position: { top: '20px' },
                })

                dialogRef.afterClosed().subscribe(deletedReason => {
                    if (deletedReason) {
                        this.navigationService.loadBarStart()
                        if (this.business.certificateId) {
                            this.invoicesService.cancelInvoice(sale._id, deletedReason).subscribe({
                                next: () => {
                                    this.fetchData()
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage('Comprobante anulado')
                                }, error: (error: HttpErrorResponse) => {
                                    this.navigationService.loadBarFinish()
                                    this.navigationService.showMessage(error.error.message)
                                }
                            })
                        } else {
                            this.invoicesService.softDeleteInvoice(sale._id, deletedReason).subscribe(() => {
                                this.fetchData()
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Comprobante anulado')
                            })
                        }
                    } else {
                        this.navigationService.showMessage('Debe indicar el motivo')
                    }
                })
            }
        } else {
            const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(deletedReason => {
                if (deletedReason) {
                    this.navigationService.loadBarStart()
                    if (this.business.certificateId) {
                        this.invoicesService.cancelInvoice(sale._id, deletedReason).subscribe({
                            next: () => {
                                this.fetchData()
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage('Comprobante anulado')
                            }, error: (error: HttpErrorResponse) => {
                                this.navigationService.loadBarFinish()
                                this.navigationService.showMessage(error.error.message)
                            }
                        })
                    } else {
                        this.invoicesService.softDeleteInvoice(sale._id, deletedReason).subscribe(() => {
                            this.fetchData()
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage('Comprobante anulado')
                        })
                    }
                } else {
                    this.navigationService.showMessage('Debe indicar el motivo')
                }
            })
        }
    }

}
