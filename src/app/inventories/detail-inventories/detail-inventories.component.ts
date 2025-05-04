import { CommonModule, formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { CreditNoteItemModel } from '../../credit-notes/credit-note-item.model';
import { CreditNotesService } from '../../credit-notes/credit-notes.service';
import { DialogDetailCreditNotesComponent } from '../../credit-notes/dialog-detail-credit-notes/dialog-detail-credit-notes.component';
import { DialogDetailIncidentsComponent } from '../../incidents/dialog-detail-incidents/dialog-detail-incidents.component';
import { IncidentItemModel } from '../../incidents/incident-item.model';
import { IncidentsService } from '../../incidents/incidents.service';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { MaterialModule } from '../../material.module';
import { DialogDetailMovesComponent } from '../../moves/dialog-detail-moves/dialog-detail-moves.component';
import { MoveItemModel } from '../../moves/move-item.model';
import { MovesService } from '../../moves/moves.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogDetailPurchasesComponent } from '../../purchases/dialog-detail-purchases/dialog-detail-purchases.component';
import { PurchaseItemModel } from '../../purchases/purchase-item.model';
import { PurchasesService } from '../../purchases/purchases.service';
import { SaleItemModel } from '../../sales/sale-item.model';
import { SalesService } from '../../sales/sales.service';
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component';
import { DialogCreatePurchaseComponent } from '../dialog-create-purchase/dialog-create-purchase.component';
import { DialogMoveStockComponent } from '../dialog-move-stock/dialog-move-stock.component';
import { DialogRemoveStockComponent } from '../dialog-remove-stock/dialog-remove-stock.component';

@Component({
    selector: 'app-detail-inventories',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './detail-inventories.component.html',
    styleUrls: ['./detail-inventories.component.sass'],
})
export class DetailInventoriesComponent {

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly purchasesService: PurchasesService,
        private readonly salesService: SalesService,
        private readonly incidentsService: IncidentsService,
        private readonly creditNotesService: CreditNotesService,
        private readonly movesService: MovesService,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
    ) { }

    @ViewChild(MatSort) sort: MatSort = new MatSort()
    displayedColumns: string[] = ['createdAt', 'quantity', 'actions']
    dataSourceSales: MatTableDataSource<any> = new MatTableDataSource()
    dataSourcePurchases: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceOutIncidents: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceInIncidents: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceCreditNotes: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceMovesIn: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceMovesOut: MatTableDataSource<any> = new MatTableDataSource()
    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    saleCount: number = 0
    purchaseCount: number = 0
    incidentOutCount: number = 0
    incidentInCount: number = 0
    creditNoteCount: number = 0
    moveInCount: number = 0
    moveOutCount: number = 0
    saleItems: SaleItemModel[] = []
    purchaseItems: PurchaseItemModel[] = []
    incidentOutItems: IncidentItemModel[] = []
    incidentInItems: IncidentItemModel[] = []
    creditNoteItems: CreditNoteItemModel[] = []
    moveInItems: MoveItemModel[] = []
    moveOutItems: MoveItemModel[] = []
    product: ProductModel | null = null
    office: OfficeModel = new OfficeModel()
    today: Date = new Date()

    private pageIndexPurchase: number = 1
    private pageIndexSale: number = 1
    private pageIndexIncident: number = 1
    private pageIndexCreditNote: number = 1
    private pageIndexMoveIn: number = 1
    private pageIndexMoveOut: number = 1
    private pageSize: number = 20
    private productId: string = ''
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
            // const { startDate, endDate } = this.formGroup.value
            this.navigationService.loadBarStart()
            
            const params = { isIncludeParent: true, productId: this.productId }
            const countSaleItems = await lastValueFrom(this.salesService.getCountSaleItems(params))
            const countPurchaseItems = await lastValueFrom(this.purchasesService.getCountPurchaseItems(params))
            const countIncidentInItems = await lastValueFrom(this.incidentsService.getCountIncidentInItems(params))
            const countIncidentOutItems = await lastValueFrom(this.incidentsService.getCountIncidentOutItems(params))

            const promises: Promise<any>[] = [] 
            const chunk = 500
            
            for (let index = 0; index < countSaleItems / chunk; index++) {
                const promise = lastValueFrom(this.salesService.getSaleItemsByProductPage(this.productId, index + 1, chunk, params))
                promises.push(promise)
            }

            for (let index = 0; index < countPurchaseItems / chunk; index++) {
                const promise = lastValueFrom(this.purchasesService.getPurchaseItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }

            for (let index = 0; index < countIncidentInItems / chunk; index++) {
                const promise = lastValueFrom(this.incidentsService.getIncidentInItemsByPageProduct(index + 1, chunk, this.productId, params))
                promises.push(promise)
            }
            
            for (let index = 0; index < countIncidentOutItems / chunk; index++) {
                const promise = lastValueFrom(this.incidentsService.getIncidentOutItemsByPageProduct(index + 1, chunk, this.productId, params))
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
                    this.product?.price,
                    (this.product?.price || 0) * stock,
                ])
            }
            if (this.product) {
                const name = `KARDEX_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}_${this.product.fullName.replace(/ /g, '_').toUpperCase()}`
                buildExcel(body, name, wscols, [])
            }
        })
    }

    onRangeChange() {
        if (this.formGroup.valid) {
            const { startDate, endDate } = this.formGroup.value
            const queryParams: Params = { startDate, endDate, pageIndex: 0 }
            Object.assign(this.params, queryParams)

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
        }
    }

    onPurchaseStock() {
        if (this.product) {
            const dialogRef = this.matDialog.open(DialogCreatePurchaseComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                    this.fetchCountQuantity()
                }
            })
        }
    }

    onAddStock() {
        if (this.product) {
            const dialogRef = this.matDialog.open(DialogAddStockComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                    this.fetchCountQuantity()
                }
            })
        }
    }

    onRemoveStock() {
        if (this.product) {
            if (this.product.isTrackStock) {
                const dialogRef = this.matDialog.open(DialogRemoveStockComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: this.product,
                })

                dialogRef.afterClosed().subscribe(ok => {
                    if (ok) {
                        if (this.product) {
                            this.fetchData()
                            this.fetchCountQuantity()
                        }
                    }
                })
            } else {
                this.navigationService.showMessage('Es necesario trakear el stock')
            }
        }
    }

    onMoveStock() {
        if (this.product) {
            const dialogRef = this.matDialog.open(DialogMoveStockComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                    this.fetchCountQuantity()
                }
            })
        } else {
            this.navigationService.showMessage('Es necesario trakear el stock')
        }
    }

    fetchCountQuantity() {
        this.salesService.getCountQuantitySaleItemsByProduct(this.productId).subscribe(countQuantity => {
            this.saleCount = countQuantity
        })

        this.purchasesService.getCountQuantityPurchaseItemsByProduct(this.productId).subscribe(countQuantity => {
            this.purchaseCount = countQuantity
        })

        this.incidentsService.getCountQuantityIncidentOutItemsByProduct(this.productId).subscribe(countQuantity => {
            this.incidentOutCount = countQuantity
        })

        this.incidentsService.getCountQuantityIncidentInItemsByProduct(this.productId).subscribe(countQuantity => {
            this.incidentInCount = countQuantity
        })

        this.creditNotesService.getCountQuantityCreditNoteItemsByProduct(this.productId).subscribe(countQuantity => {
            this.creditNoteCount = countQuantity
        })

        this.movesService.getCountQuantityMovesInByProduct(this.productId).subscribe(countQuantity => {
            this.moveInCount = countQuantity
        })

        this.movesService.getCountQuantityMovesOutByProduct(this.productId).subscribe(countQuantity => {
            this.moveOutCount = countQuantity
        })
    }

    fetchData() {
        this.productsService.getProductById(this.productId).subscribe(product => {
            this.product = product
            this.navigationService.setTitle(`Detalles ${product.fullName}`)
        })

        this.salesService.getSaleItemsByProductPage(this.productId, this.pageIndexSale, this.pageSize, this.params).subscribe(saleItems => {
            this.saleItems = saleItems
            this.dataSourceSales = new MatTableDataSource(saleItems)
            this.dataSourceSales.sort = this.sort
        })

        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndexPurchase, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.dataSourcePurchases = new MatTableDataSource(purchaseItems)
            this.dataSourcePurchases.sort = this.sort
        })

        this.incidentsService.getIncidentOutItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(incidentOutItems => {
            this.incidentOutItems = incidentOutItems
            this.dataSourceOutIncidents = new MatTableDataSource(incidentOutItems)
            this.dataSourceOutIncidents.sort = this.sort
        })

        this.incidentsService.getIncidentInItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(incidentInItems => {
            this.incidentInItems = incidentInItems
            this.dataSourceInIncidents = new MatTableDataSource(incidentInItems)
            this.dataSourceInIncidents.sort = this.sort
        })

        this.creditNotesService.getCreditNoteItemsByPageProduct(this.pageIndexCreditNote, this.pageSize, this.productId, this.params).subscribe(creditNoteItems => {
            this.creditNoteItems = creditNoteItems
            this.dataSourceCreditNotes = new MatTableDataSource(creditNoteItems)
            this.dataSourceCreditNotes.sort = this.sort
        })

        this.movesService.getMoveInItemsByPageProduct(this.pageIndexMoveIn, this.pageSize, this.productId, this.params).subscribe(moveInItems => {
            this.moveInItems = moveInItems
            this.dataSourceMovesIn = new MatTableDataSource(moveInItems)
            this.dataSourceMovesIn.sort = this.sort
        })

        this.movesService.getMoveOutItemsByPageProduct(this.pageIndexMoveOut, this.pageSize, this.productId, this.params).subscribe(moveOutItems => {
            this.moveOutItems = moveOutItems
            this.dataSourceMovesOut = new MatTableDataSource(moveOutItems)
            this.dataSourceMovesOut.sort = this.sort
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

    onDetailCreditNotes(creditNoteId: string) {
        const dialogRef = this.matDialog.open(DialogDetailCreditNotesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: creditNoteId,
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

    onDetailIncidents(incidentId: string) {
        const dialogRef = this.matDialog.open(DialogDetailIncidentsComponent, {
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

    onDetailMoves(moveId: string) {
        const dialogRef = this.matDialog.open(DialogDetailMovesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: moveId,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
                this.fetchCountQuantity()
            }
        })
    }
}
