import { Component, ViewChild, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { lastValueFrom, Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { buildExcel } from '../../buildExcel'
import { CreditNoteItemModel } from '../../credit-notes/credit-note-item.model'
import { CreditNotesService } from '../../credit-notes/credit-notes.service'
import { DialogDetailCreditNotesComponent } from '../../credit-notes/dialog-detail-credit-notes/dialog-detail-credit-notes.component'
import { DialogDetailInIncidentsComponent } from '../../incidents/dialog-detail-in-incidents/dialog-detail-in-incidents.component'
import { DialogDetailOutIncidentsComponent } from '../../incidents/dialog-detail-out-incidents/dialog-detail-out-incidents.component'
import { IncidentItemModel } from '../../incidents/incident-item.model'
import { IncidentsService } from '../../incidents/incidents.service'
import { DialogDetailSalesComponent } from '../../sales/dialog-detail-sales/dialog-detail-sales.component'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component'
import { PurchaseItemModel } from '../../purchases/purchase-item.model'
import { PurchasesService } from '../../purchases/purchases.service'
import { SaleItemModel } from '../../sales/sale-item.model'
import { SalesService } from '../../sales/sales.service'
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component'
import { DialogCreatePurchaseComponent } from '../dialog-create-purchase/dialog-create-purchase.component'
import { DialogRemoveStockComponent } from '../dialog-remove-stock/dialog-remove-stock.component'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-detail-inventories',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './detail-inventories.component.html',
    styleUrls: ['./detail-inventories.component.sass'],
})
export class DetailInventoriesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly navigationService = inject(NavigationService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly salesService = inject(SalesService)
    private readonly incidentsService = inject(IncidentsService)

    @ViewChild(MatSort) sort: MatSort = new MatSort()
    displayedColumns: string[] = ['createdAt', 'price', 'cost', 'quantity', 'observation', 'actions']
    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    dataSourceSales: MatTableDataSource<any> = new MatTableDataSource()
    dataSourcePurchases: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceOutIncidents: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceInIncidents: MatTableDataSource<any> = new MatTableDataSource()

    $saleItemsCount = signal<number>(0)
    $purchaseItemsCount = signal<number>(0)
    $outIncidentItemsCount = signal<number>(0)
    $inIncidentItemsCount = signal<number>(0)

    $saleItems = signal<SaleItemModel[]>([])
    $purchaseItems = signal<PurchaseItemModel[]>([])
    $outIncidentItems = signal<IncidentItemModel[]>([])
    $inIncidentItems = signal<IncidentItemModel[]>([])
    $product = signal<ProductModel | null>(null)
    office: OfficeModel = new OfficeModel()
    today: Date = new Date()
    productId: string = ''

    private pageIndexPurchase: number = 1
    private pageIndexSale: number = 1
    private pageIndexIncident: number = 1
    private pageSize: number = 20
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.productId = this.activatedRoute.snapshot.params['productId']
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.fetchData()
            this.fetchCountQuantity()
        })

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar Kardex', icon: 'file_download', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            this.navigationService.loadBarStart()

            const params = { isIncludeParent: true, productId: this.productId }
            const countSaleItems = await lastValueFrom(this.salesService.getCountSaleItems(params))
            const countPurchaseItems = await lastValueFrom(this.purchasesService.getCountPurchaseItemsByProduct(this.productId, params))
            const countIncidentInItems = await lastValueFrom(this.incidentsService.getCountInIncidentItems(params))
            const countIncidentOutItems = await lastValueFrom(this.incidentsService.getCountOutIncidentItems(params))

            const promises: Promise<any>[] = []
            const chunk = 500

            for (let index = 0; index < countSaleItems / chunk; index++) {
                const promise = lastValueFrom(this.salesService.getSaleItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }

            for (let index = 0; index < countPurchaseItems / chunk; index++) {
                const promise = lastValueFrom(this.purchasesService.getPurchaseItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }

            for (let index = 0; index < countIncidentInItems / chunk; index++) {
                const promise = lastValueFrom(this.incidentsService.getInIncidentItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }

            for (let index = 0; index < countIncidentOutItems / chunk; index++) {
                const promise = lastValueFrom(this.incidentsService.getOutIncidentItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }

            const values = await Promise.all(promises)
            this.navigationService.loadBarFinish()
            const items: any[] = values.flat()

            items.sort((a: any, b: any) => {
                if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) {
                    return 1
                }
                if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()) {
                    return -1
                }
                return 0
            })

            const wscols = [10, 10, 10, 30, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
            let body = []
            body.push([
                'TIPO',
                'F. REGISTRO',
                'H. REGISTRO',
                'CLIENTE/PROVEEDOR',
                'N° DOCUMENTO',
                'INGRESO CANTIDAD',
                'INGRESO PRECIO',
                'INGRESO VALOR',
                'SALIDA CANTIDAD',
                'SALIDA PRECIO',
                'SALIDA VALOR',
                'STOCK ACTUAL',
                'PRECIO PROMEDIO',
                'STOCK VALORIZADO',
            ])

            let stock = 0

            for (const item of items) {
                let providercustomer: any = {}
                let serie = ''

                let inQuantity = 0
                let inPrice = 0
                let inCharge = 0

                let outQuantity = 0
                let outPrice = 0
                let outCharge = 0

                if (item.deletedAt) {
                    continue
                }

                if (item.type === 'VENTA') {
                    providercustomer = item.sale?.customer || {}
                    serie = `${item.sale.invoicePrefix}${this.office.serialPrefix}-${item.sale.invoiceNumber}`
                    outQuantity = item.quantity
                    outPrice = item.price
                    outCharge = item.price * item.quantity
                    stock -= item.quantity
                }
                if (item.type === 'COMPRA') {
                    providercustomer = item.purchase?.provider || {}
                    serie = item.purchase.serie
                    inQuantity = item.quantity
                    inPrice = item.cost
                    inCharge = item.cost * item.quantity
                    stock += item.quantity
                }
                if (item.type === 'AUMENTO') {
                    stock += item.quantity
                }
                if (item.type === 'REDUCCION') {
                    stock -= item.quantity
                }
                body.push([
                    item.type,
                    formatDate(new Date(item.createdAt), 'dd/MM/yyyy', 'en-US'),
                    formatDate(new Date(item.createdAt), 'hh:mm a', 'en-US'),
                    providercustomer.name,
                    serie,
                    inQuantity,
                    inPrice,
                    inCharge,
                    outQuantity,
                    outPrice,
                    outCharge,
                    stock,
                    this.$product()?.price,
                    (this.$product()?.price || 0) * stock,
                ])
            }
            if (this.$product()) {
                const name = `KARDEX_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.$product()?.fullName.replace(/ /g, '_').toUpperCase()}`
                buildExcel(body, name, wscols, [])
            }
        })
    }

    fetchCountQuantity() {
        this.salesService.getCountQuantitySaleItemsByProduct(this.productId).subscribe(countQuantity => {
            this.$saleItemsCount.set(countQuantity)
        })

        this.purchasesService.getCountQuantityPurchaseItemsByProduct(this.productId).subscribe(countQuantity => {
            this.$purchaseItemsCount.set(countQuantity)
        })

        this.incidentsService.getCountQuantityOutIncidentItemsByProduct(this.productId).subscribe(countQuantity => {
            this.$outIncidentItemsCount.set(countQuantity)
        })

        this.incidentsService.getCountQuantityIncidentItemsByProduct(this.productId).subscribe(countQuantity => {
            this.$inIncidentItemsCount.set(countQuantity)
        })
    }

    fetchData() {
        this.productsService.getProductById(this.productId).subscribe(product => {
            this.$product.set(product)
            this.navigationService.setTitle(`Detalles ${product.fullName}`)
        })

        this.salesService.getSaleItemsByPageProduct(this.pageIndexSale, this.pageSize, this.productId, this.params).subscribe(saleItems => {
            this.$saleItems.set(saleItems)
            this.dataSourceSales = new MatTableDataSource(saleItems)
            this.dataSourceSales.sort = this.sort
        })

        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndexPurchase, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.$purchaseItems.set(purchaseItems)
            this.dataSourcePurchases = new MatTableDataSource(purchaseItems)
            this.dataSourcePurchases.sort = this.sort
        })

        this.incidentsService.getOutIncidentItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(outIncidentItems => {
            this.$outIncidentItems.set(outIncidentItems)
            this.dataSourceOutIncidents = new MatTableDataSource(outIncidentItems)
            this.dataSourceOutIncidents.sort = this.sort
        })

        this.incidentsService.getInIncidentItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(inIncidentItems => {
            this.$inIncidentItems.set(inIncidentItems)
            this.dataSourceInIncidents = new MatTableDataSource(inIncidentItems)
            this.dataSourceInIncidents.sort = this.sort
        })
    }

    onDetailPurchases(purchaseId: string) {
        const dialogRef = this.matDialog.open(DialogDetailPurchasesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
                this.fetchCountQuantity()
            }
        })
    }

    onDetailSales(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onDetailInIncidents(incidentId: string) {
        const dialogRef = this.matDialog.open(DialogDetailInIncidentsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: incidentId,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
                this.fetchCountQuantity()
            }
        })
    }

    onDetailOutIncidents(incidentId: string) {
        const dialogRef = this.matDialog.open(DialogDetailOutIncidentsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: incidentId,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
                this.fetchCountQuantity()
            }
        })
    }

}
