import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { CreditNoteItemModel } from '../../credit-notes/credit-note-item.model';
import { CreditNotesService } from '../../credit-notes/credit-notes.service';
import { DialogDetailCreditNotesComponent } from '../../credit-notes/dialog-detail-credit-notes/dialog-detail-credit-notes.component';
import { DialogDetailIncidentsComponent } from '../../incidents/dialog-detail-incidents/dialog-detail-incidents.component';
import { IncidentItemModel } from '../../incidents/incident-item.model';
import { IncidentsService } from '../../incidents/incidents.service';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
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
import { DialogRemoveStockComponent } from '../dialog-remove-stock/dialog-remove-stock.component';
import { DialogMoveStockComponent } from '../dialog-move-stock/dialog-move-stock.component';

@Component({
    selector: 'app-detail-inventories',
    templateUrl: './detail-inventories.component.html',
    styleUrls: ['./detail-inventories.component.sass']
})
export class DetailInventoriesComponent implements OnInit {

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
    displayedColumns: string[] = ['createdAt', 'quantity', 'type', 'actions']
    dataSourceSales: MatTableDataSource<any> = new MatTableDataSource()
    dataSourcePurchases: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceIncidents: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceCreditNotes: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceMovesIn: MatTableDataSource<any> = new MatTableDataSource()
    dataSourceMovesOut: MatTableDataSource<any> = new MatTableDataSource()
    formGroup: FormGroup = this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
    })
    saleCount: number = 0
    saleCountInit: number = 0
    purchaseCount: number = 0
    purchaseCountInit: number = 0
    incidentCount: number = 0
    incidentCountInit: number = 0
    creditNoteCount: number = 0
    creditNoteCountInit: number = 0
    moveInCount: number = 0
    moveInCountInit: number = 0
    moveOutCount: number = 0
    moveOutCountInit: number = 0
    saleItems: SaleItemModel[] = []
    purchaseItems: PurchaseItemModel[] = []
    incidentItems: IncidentItemModel[] = []
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

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.productId = this.activatedRoute.snapshot.params['productId']
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.fetchData()
            this.fetchCount()
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
                    this.fetchCount()
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
                            this.fetchCount()
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
                    this.fetchCount()
                }
            })
        } else {
            this.navigationService.showMessage('Es necesario trakear el stock')
        }
    }

    fetchCount() {
        this.salesService.getCountQuantitySaleItemsByProduct(this.productId).subscribe(countQuantity => {
            this.saleCount = countQuantity
        })

        this.purchasesService.getCountQuantityPurchaseItemsByProduct(this.productId).subscribe(countQuantity => {
            this.purchaseCount = countQuantity
        })

        this.incidentsService.getCountQuantityIncidentItemsByProduct(this.productId).subscribe(countQuantity => {
            this.incidentCount = countQuantity
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

        this.salesService.getSaleItemsByPageProduct(this.pageIndexSale, this.pageSize, this.productId, this.params).subscribe(saleItems => {
            this.saleItems = saleItems
            this.dataSourceSales = new MatTableDataSource(saleItems)
            this.dataSourceSales.sort = this.sort
        })

        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndexPurchase, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.dataSourcePurchases = new MatTableDataSource(purchaseItems)
            this.dataSourcePurchases.sort = this.sort
        })

        this.incidentsService.getIncidentItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(incidentItems => {
            this.incidentItems = incidentItems
            this.dataSourceIncidents = new MatTableDataSource(incidentItems)
            this.dataSourceIncidents.sort = this.sort
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

    onMorePurchases() {
        this.pageIndexPurchase++
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseItemsByPageProduct(this.pageIndexPurchase, this.pageSize, this.productId, this.params).subscribe(purchaseItems => {
            this.navigationService.loadBarFinish()
            if (purchaseItems.length === 0) {
                this.navigationService.showMessage('No hay mas compras')
            } else {
                this.purchaseItems = [...this.purchaseItems, ...purchaseItems]
            }
        })
    }

    onMoreSales() {
        this.pageIndexSale++
        this.navigationService.loadBarStart()
        this.salesService.getSaleItemsByPageProduct(this.pageIndexSale, this.pageSize, this.productId, this.params).subscribe(saleItems => {
            this.navigationService.loadBarFinish()
            if (saleItems.length === 0) {
                this.navigationService.showMessage('No hay mas ventas')
            } else {
                this.saleItems = [...this.saleItems, ...saleItems]
            }
        })
    }

    onMoreIncidents() {
        this.pageIndexIncident++
        this.navigationService.loadBarStart()
        this.incidentsService.getIncidentItemsByPageProduct(this.pageIndexIncident, this.pageSize, this.productId, this.params).subscribe(incidentItems => {
            this.navigationService.loadBarFinish()
            if (incidentItems.length === 0) {
                this.navigationService.showMessage('No hay mas incidencias')
            } else {
                this.incidentItems = [...this.incidentItems, ...incidentItems]
            }
        })
    }

    onMoreCreditNotes() {
        this.pageIndexCreditNote++
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNoteItemsByPageProduct(this.pageIndexCreditNote, this.pageSize, this.productId, this.params).subscribe(creditNoteItems => {
            this.navigationService.loadBarFinish()
            if (creditNoteItems.length === 0) {
                this.navigationService.showMessage('No hay mas notas de credito')
            } else {
                this.creditNoteItems = [...this.creditNoteItems, ...creditNoteItems]
            }
        })
    }

    onMoreMovesIn() {
        this.pageIndexMoveIn++
        this.navigationService.loadBarStart()
        this.movesService.getMoveInItemsByPageProduct(this.pageIndexMoveIn, this.pageSize, this.productId, this.params).subscribe(moveInItems => {
            this.navigationService.loadBarFinish()
            if (moveInItems.length === 0) {
                this.navigationService.showMessage('No hay mas movimientos')
            } else {
                this.moveInItems = [...this.moveInItems, ...moveInItems]
            }
        })
    }

    onMoreMovesOut() {
        this.pageIndexMoveOut++
        this.navigationService.loadBarStart()
        this.movesService.getMoveOutItemsByPageProduct(this.pageIndexMoveOut, this.pageSize, this.productId, this.params).subscribe(moveOutItems => {
            this.navigationService.loadBarFinish()
            if (moveOutItems.length === 0) {
                this.navigationService.showMessage('No hay mas movimientos')
            } else {
                this.moveOutItems = [...this.moveOutItems, ...moveOutItems]
            }
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
                this.fetchCount()
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
                this.fetchCount()
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
                this.fetchCount()
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
                this.fetchCount()
            }
        })
    }
}
