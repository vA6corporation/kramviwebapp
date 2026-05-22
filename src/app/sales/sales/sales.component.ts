import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { DialogPasswordComponent } from '../dialog-password/dialog-password.component'
import { buildExcel } from '../../buildExcel'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PrintService } from '../../print/print.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { InvoiceCode } from '../../sales/invoice-code.enum'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../../users/users.service'
import { ExcelConcar } from '../ExcelConcar'
import { ExcelKramvi } from '../ExcelKramvi'
import { ExcelSimple } from '../ExcelSimple'
import { DialogAdminComponent, DialogAdminData } from '../dialog-admin/dialog-admin.component'
import { DialogBadCdrsComponent } from '../dialog-bad-cdrs/dialog-bad-cdrs.component'
import { DialogDeleteSaleComponent } from '../dialog-delete-sale/dialog-delete-sale.component'
import { DialogDetailSalesComponent } from '../dialog-detail-sales/dialog-detail-sales.component'
import { InvoicesService } from '../../invoices/invoices.service'
import { SheetExportPdfComponent } from '../sheet-export-pdf/sheet-export-pdf.component'
import { SheetInvoicesComponent } from '../sheet-invoices/sheet-invoices.component'
import { SheetPrintComponent } from '../sheet-print/sheet-print.component'
import { CreditNotesService } from '../../credit-notes/credit-notes.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-sales',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.sass',
})
export class SalesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly matDialog = inject(MatDialog)
    private readonly matBottomSheet = inject(MatBottomSheet)
    private readonly salesService = inject(SalesService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly invoicesService = inject(InvoicesService)
    private readonly officesService = inject(OfficesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly usersService = inject(UsersService)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '',
        stateType: '',
        userId: '',
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    $users = signal<UserModel[]>([])
    displayedColumns: string[] = ['checked', 'createdAt', 'serial', 'customer', 'user', 'charge', 'observation', 'actions']
    $dataSource = signal<SaleModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $saleIds = signal<number[]>([])
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
    invoiceCode = InvoiceCode

    private categories: CategoryModel[] = []
    private params: Params = {}
    private key: string = ''
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

            Object.assign(this.params, { officeId: this.office.id })
            this.formGroup.patchValue({ officeId: this.office.id })

            const queryParams = this.activatedRoute.snapshot.queryParams
            const { startDate, endDate, pageIndex, pageSize, invoiceCode, stateType, userId, key, officeId } = queryParams

            this.$saleIds.set([])

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

            Object.assign(this.params, {
                officeId: officeId || this.office.id,
                invoiceCode: invoiceCode || ''
            })

            this.formGroup.patchValue({
                invoiceCode: invoiceCode || '',
                stateType: stateType || '',
                userId: userId || '',
                officeId: officeId || this.office.id,
            })

            this.fetchData()
            this.fetchCount()
        })

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.$users.set(users)
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'send_massive', label: 'Enviar a Sunat', icon: 'near_me', show: false },
            { id: 'copy_invoices', label: 'Copiar ventas', icon: 'content_copy', show: false },
            { id: 'print_massive', label: 'Imprimir', icon: 'printer', show: false },
            { id: 'excel_simple', label: 'Excel simple', icon: 'file_download', show: false },
            { id: 'excel_detail', label: 'Excel detallado', icon: 'file_download', show: false },
            { id: 'excel_kramvi', label: 'Excel contabilidad', icon: 'file_download', show: false },
            { id: 'excel_concar', label: 'Excel concar', icon: 'file_download', show: false },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.$saleIds.set([])
            this.pageIndex = 0
            this.$length.set(0)

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
                    this.$dataSource.set(sales)
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
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

    async copyMassive() {
        if (this.$saleIds().length) {
            const ok = confirm('Esta seguro de realizar las copias?...')
            if (ok) {
                this.navigationService.loadBarStart()
                this.invoicesService.copyInvoiceMassive(this.$saleIds()).subscribe({
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
        if (this.$saleIds().length) {
            const queryParams: Params = { saleIds: this.$saleIds() }
            this.router.navigate(['/charge/from'], { queryParams })
        } else {
            this.navigationService.showMessage('Seleccione un comprobante')
        }
    }

    onOptions(sale: SaleModel) {
        const matBottomSheetRef = this.matBottomSheet.open(SheetInvoicesComponent, { data: sale })
        matBottomSheetRef.instance.handleSendInvoice().subscribe(() => {
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
                        this.router.navigate(['/biller', sale.id, 'edit'])
                    } else {
                        this.router.navigate(['/posStandard', sale.id, 'edit'])
                    }
                }
            })
        } else {
            if (sale.isBiller) {
                this.router.navigate(['/biller', sale.id, 'edit'])
            } else {
                this.router.navigate(['/posStandard', sale.id, 'edit'])
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
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office.id }))
                if (length) {
                    const chunk = 500
                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: length / chunk
                    })

                    for (let index = 0; index < length / chunk; index++) {
                        const values = await lastValueFrom(this.salesService.getSalesByRangeDatePageTax(startDate, endDate, index + 1, chunk, { officeId: office.id }))
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

    checkSaleId(isChecked: boolean, saleId: number) {
        if (isChecked) {
            this.$saleIds.update(values => [...values, saleId])
        } else {
            const index = this.$saleIds().indexOf(saleId)
            if (index > -1) {
                this.$saleIds().splice(index, 1)
            }
        }
    }

    checkAllSales(isChecked: boolean) {
        if (isChecked) {
            this.$saleIds.set([])
            this.$saleIds.set(this.$dataSource().map(e => e.id))
        } else {
            this.$saleIds.set([])
        }
    }

    async sendMassive() {
        if (this.$saleIds().length) {
            this.navigationService.loadBarStart()
            this.invoicesService.sendInvoiceMassive(this.$saleIds()).subscribe({
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
                this.invoicesService.sendInvoiceMassive(this.$saleIds()).subscribe({
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
        for (const saleId of this.$saleIds()) {
            await new Promise((resolve, reject) => {
                this.salesService.getSaleById(saleId).subscribe(sale => {
                    this.printService.printTicket80mm(sale)
                    resolve(true)
                })
            })
        }
        this.navigationService.loadBarFinish()
    }

    invoiceCodes = [
        { code: '', label: 'TODOS LOS COMPROBANTES' },
        { code: '00', label: 'NOTA DE VENTA' },
        { code: '03', label: 'BOLETA' },
        { code: '01', label: 'FACTURA' },
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
                const chunk = 500
                const sales: SaleModel[] = []
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office.id }))

                if (length) {
                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: length / chunk
                    })

                    for (let index = 0; index < length / chunk; index++) {
                        const values = await lastValueFrom(this.salesService.getSalesByRangeDatePageTax(startDate, endDate, index + 1, chunk, { officeId: office.id }))
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
                data: this.$length() / chunk
            })

            for (let index = 0; index < this.$length() / chunk; index++) {
                const values = await lastValueFrom(this.salesService.getSalesWithDetailsByRangeDatePage(startDate, endDate, index + 1, chunk, {}))
                dialogRef.componentInstance.onComplete()
                sales.push(...values)
            }

            this.navigationService.loadBarFinish()
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            let body = []
            body.push([
                'F. EMISION',
                'H. EMISION',
                'RUC/DNI/CE',
                'CLIENTE',
                'DIRECCION',
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
                'USUARIO',
                'ANULADO',
                'OBSERVACIONES'
            ])

            for (const sale of sales) {
                const { customer, saleItems } = sale
                for (const saleItem of saleItems) {
                    let paymentNames = ''
                    for (const payment of sale.payments) {
                        const foundPaymentMethod = this.paymentMethods.find(e => e.id === payment.paymentMethodId)
                        paymentNames += foundPaymentMethod?.name + ' '
                    }
                    body.push([
                        formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                        formatDate(sale.createdAt, 'HH', 'en-US'),
                        customer?.document,
                        (customer?.name || 'VARIOS').toUpperCase(),
                        customer?.address,
                        customer?.phone,
                        sale.invoiceName,
                        `${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`,
                        saleItem.fullName.toUpperCase(),
                        this.categories.find(e => e.id === saleItem.categoryId)?.name.toUpperCase(),
                            Number(saleItem.quantity.toFixed(2)),
                        saleItem.price,
                        Number((saleItem.price * saleItem.quantity).toFixed(2)),
                        saleItem.cost || 0,
                        Number(((saleItem.price * saleItem.quantity) - (saleItem.cost || 0 * saleItem.quantity)).toFixed(2)),
                        sale.currencyCode,
                        paymentNames,
                        saleItem.igvCode === '11' ? 'SI' : 'NO',
                        sale.user.name.toUpperCase(),
                        sale.deletedAt ? 'SI' : 'NO',
                        sale.observation,
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

            const excelSimple = new ExcelSimple(startDate, endDate, this.business, this.paymentMethods)

            for (const office of offices) {
                const chunk = 500
                const sales: SaleModel[] = []
                const length = await lastValueFrom(this.salesService.getCountSalesByRangeDateTax(startDate, endDate, { officeId: office.id }))

                if (length) {
                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.$length() / chunk
                    })

                    for (let index = 0; index < this.$length() / chunk; index++) {
                        const values = await lastValueFrom(this.salesService.getSalesByPage(index + 1, chunk, { officeId: office.id, startDate, endDate }))
                        dialogRef.componentInstance.onComplete()
                        sales.push(...values)
                    }
                    excelSimple.addSales(sales, office)
                }
            }

            excelSimple.buildExcel()
        } else {
            this.navigationService.showMessage('Seleccione un rango de fechas')
        }
    }

    onClickOptions(event: MouseEvent, saleId: string) {
        if (event.ctrlKey) {
            const data: DialogAdminData = {
                saleId,
                saleIds: this.$saleIds()
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

    onInvoiceChange(invoiceCode: string) {
        this.key = ''
        this.pageIndex = 0
        const queryParams: Params = { invoiceCode, key: null }

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
            this.$length.set(count)
        })
    }

    fetchData() {
        this.$saleIds.set([])
        if (this.key) {
            this.navigationService.loadBarStart()
            this.salesService.getSalesByKey(this.key).subscribe({
                next: sales => {
                    this.$dataSource.set(sales)
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
                this.$dataSource.set(sales)
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
        this.matBottomSheet.open(SheetPrintComponent, { data: saleId })
    }

    onExportPdf(saleId: string) {
        this.matBottomSheet.open(SheetExportPdfComponent, { data: saleId })
    }

    onDeleteInvoice(sale: SaleModel) {
        if (this.business.certificateId && sale.cdr === null && sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
            this.navigationService.loadBarStart()
            this.invoicesService.sendInvoice(sale.id).subscribe({
                next: cdr => {
                    const createdSale = JSON.parse(JSON.stringify(sale))
                    createdSale.cdr = cdr
                    this.fetchData()
                    this.navigationService.loadBarFinish()
                    this.onDeleteInvoice(createdSale)
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
                    if (sale.invoiceCode === InvoiceCode.NOTA_DE_VENTA) {
                        const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                            width: '600px',
                            position: { top: '20px' },
                        })

                        dialogRef.afterClosed().subscribe(deletedReason => {
                            if (deletedReason) {
                                this.navigationService.loadBarStart()
                                this.invoicesService.softDeleteInvoice(sale.id, deletedReason).subscribe(() => {
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
                                        this.invoicesService.cancelInvoice(sale.id, deletedReason).subscribe({
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
                                        this.invoicesService.softDeleteInvoice(sale.id, deletedReason).subscribe(() => {
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

        if (sale.invoiceCode === InvoiceCode.NOTA_DE_VENTA) {
            const dialogRef = this.matDialog.open(DialogDeleteSaleComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(deletedReason => {
                if (deletedReason) {
                    this.navigationService.loadBarStart()
                    this.invoicesService.softDeleteInvoice(sale.id, deletedReason).subscribe(() => {
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
                            this.invoicesService.cancelInvoice(sale.id, deletedReason).subscribe({
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
                            this.invoicesService.softDeleteInvoice(sale.id, deletedReason).subscribe(() => {
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
                        this.invoicesService.cancelInvoice(sale.id, deletedReason).subscribe({
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
                        this.invoicesService.softDeleteInvoice(sale.id, deletedReason).subscribe(() => {
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
