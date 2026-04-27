import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { buildExcel } from '../../buildExcel'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { DialogDetailPurchasesComponent } from '../dialog-detail-purchases/dialog-detail-purchases.component'
import { PurchaseModel } from '../purchase.model'
import { PurchasesService } from '../purchases.service'
import { DialogSearchProvidersComponent } from '../../providers/dialog-search-providers/dialog-search-providers.component'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-purchases',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './purchases.component.html',
    styleUrls: ['./purchases.component.sass']
})
export class PurchasesComponent {

    private readonly purchasesService = inject(PurchasesService)
    private readonly navigationService = inject(NavigationService)
    private readonly printService = inject(PrintService)
    private readonly authService = inject(AuthService)
    private readonly matDialog = inject(MatDialog)
    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)

    formGroup: FormGroup = this.formBuilder.group({
        invoiceCode: '',
        userId: '',
        provider: this.formBuilder.group({
            id: '',
            name: ''
        }),
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
    })

    displayedColumns: string[] = ['createdAt', 'serial', 'customer', 'user', 'charge', 'observation', 'actions']
    $dataSource = signal<PurchaseModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    invoiceCode: string = ''
    office: OfficeModel = new OfficeModel()
    invoiceCodes = [
        { code: '', label: 'TODOS LOS COMPROBANTES' },
        { code: '00', label: 'NOTA DE VENTA' },
        { code: '03', label: 'BOLETA' },
        { code: '01', label: 'FACTURA' },
    ]
    private endDate: Date = new Date()
    private startDate: Date = new Date()
    private business: BusinessModel = new BusinessModel()
    private params: Params = {}

    private handleClickMenu$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Compras')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            if (id === 'excel_simple') {
                this.navigationService.loadBarStart()
                const chunk = 500
                const promises: Promise<any>[] = []
                const params = { ...this.params, sortBy: '-purchasedAt' }
                for (let index = 0; index < this.$length() / chunk; index++) {
                    const promise = lastValueFrom(this.purchasesService.getPurchasesByPage(index + 1, chunk, params))
                    promises.push(promise)
                }

                Promise.all(promises).then(values => {
                    this.navigationService.loadBarFinish()
                    const purchases = values.flat() as PurchaseModel[]
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    body.push([
                        'F. DE REGISTRO',
                        'RUC/DNI',
                        'CLIENTE',
                        'COMPROBANTE',
                        'Nº COMPROBANTE',
                        'MONEDA',
                        'BASE',
                        'IMPORTE T.',
                        'IGV',
                        'GRAVADO',
                        'EXONERADO',
                        'INAFECTO',
                        'GRATUITO',
                        'ANULADO',
                        'F. PAGO',
                        'OBSERVACIONES'
                    ])
                    for (const purchase of purchases) {
                        const { provider } = purchase
                        body.push([
                            formatDate(purchase.createdAt, 'dd/MM/yyyy', 'en-US'),
                            provider?.document,
                            (provider?.name || 'VARIOS').toUpperCase(),
                            purchase.invoiceName.toUpperCase(),
                            purchase.serie,
                            purchase.currencyCode,
                            Number((purchase.charge - purchase.igv).toFixed(2)),
                            Number((purchase.charge || 0).toFixed(2)),
                            Number((purchase.igv || 0).toFixed(2)),
                            Number((purchase.gravado || 0).toFixed(2)),
                            Number((purchase.exonerado || 0).toFixed(2)),
                            Number((purchase.inafecto || 0).toFixed(2)),
                            Number((purchase.gratuito || 0).toFixed(2)),
                            purchase.deletedAt ? 'SI' : 'NO',
                            purchase.isPaid ? 'CONTADO' : 'CREDITO',
                            purchase.observation
                        ])
                    }
                    const name = `VENTAS_DESDE_${formatDate(this.startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(this.endDate, 'dd/MM/yyyy', 'en-US')}_${this.office.name.replace(/ /g, '_')}_RUC_${this.business.ruc}`
                    buildExcel(body, name, wscols, [])
                })
            }
        })

        const { startDate, endDate, pageIndex, pageSize, invoiceCode, provider } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.formGroup.get('invoiceCode')?.patchValue(invoiceCode || '')

        if (startDate && endDate) {
            this.startDate = new Date(startDate)
            this.endDate = new Date(endDate)
            this.formGroup.patchValue({ startDate: this.startDate, endDate: this.endDate })
            Object.assign({ startDate: this.startDate, endDate: this.endDate })
        }

        if (provider) {
            const parseProvider = JSON.parse(provider)
            this.formGroup.patchValue({ provider: parseProvider })
            Object.assign(this.params, { providerId: parseProvider.id })
        }

        this.fetchData()
        this.fetchCount()
    }

    onDialogSearchProviders() {
        const dialogRef = this.matDialog.open(DialogSearchProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(provider => {
            if (provider) {
                this.formGroup.patchValue({ provider })

                const queryParams: Params = { providerId: provider.id, pageIndex: 0 }

                Object.assign(this.params, queryParams)

                this.router.navigate([], {
                    relativeTo: this.activatedRoute,
                    queryParams: queryParams,
                    queryParamsHandling: 'merge', // remove to replace all query params by provided
                })

                this.fetchData()
                this.fetchCount()
            }
        })
    }

    onPrint(purchaseId: any) {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseById(purchaseId).subscribe({
            next: purchase => {
                this.navigationService.loadBarFinish()
                this.printService.printPurchaseA4(purchase)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onExportPdf(purchaseId: any) {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseById(purchaseId).subscribe({
            next: purchase => {
                this.navigationService.loadBarFinish()
                this.printService.exportPurchaseA4(purchase)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
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

    onInvoiceChange(invoiceCode: string) {
        this.pageIndex = 0
        const queryParams: Params = { invoiceCode }

        Object.assign(this.params, queryParams)

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchasesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
            next: purchases => {
                this.navigationService.loadBarFinish()
                this.$dataSource.set(purchases)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    fetchCount() {
        this.purchasesService.getCountPurchases(this.params).subscribe(count => {
            this.$length.set(count)
        })
    }

    onDetailPurchase(purchaseId: any) {
        this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    onDeletePurchase(purchaseId: any) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.purchasesService.deletePurchase(purchaseId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

}
