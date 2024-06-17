import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogDetailIncidentSuppliesComponent } from '../../incident-supplies/dialog-detail-incident-supplies/dialog-detail-incident-supplies.component';
import { IncidentSuppliesService } from '../../incident-supplies/incident-supplies.service';
import { IncidentSupplyItemModel } from '../../incident-supplies/incident-supply-item.model';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogDetailPurchaseSuppliesComponent } from '../../purchase-supplies/dialog-detail-purchase-supplies/dialog-detail-purchase-supplies.component';
import { PurchaseSuppliesService } from '../../purchase-supplies/purchase-supplies.service';
import { PurchaseSupplyItemModel } from '../../purchase-supplies/purchase-supply-item.model';
import { SalesService } from '../../sales/sales.service';
import { SuppliesService } from '../../supplies/supplies.service';
import { SupplyModel } from '../../supplies/supply.model';
import { SaleSupplyItemModel } from '../sale-supply-item.model';

@Component({
    selector: 'app-detail-inventory-supplies',
    templateUrl: './detail-inventory-supplies.component.html',
    styleUrls: ['./detail-inventory-supplies.component.sass']
})
export class DetailInventorySuppliesComponent implements OnInit {

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly navigationService: NavigationService,
        private readonly suppliesService: SuppliesService,
        private readonly salesService: SalesService,
        private readonly incidentSuppliesService: IncidentSuppliesService,
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly matDialog: MatDialog,
    ) { }

    purchaseSupplyItems: PurchaseSupplyItemModel[] = []
    purchaseSupplyItemsQuantity: number = 0
    saleSupplyItems: SaleSupplyItemModel[] = []
    saleSupplyItemsQuantity: number = 0
    incidentSupplyItems: IncidentSupplyItemModel[] = []
    incidentSupplyItemsQuantity: number = 0
    supply: SupplyModel | null = null

    private pageIndex: number = 0
    private pageSize: number = 100
    private supplyId: string = ''

    ngOnInit(): void {
        this.supplyId = this.activatedRoute.snapshot.params['supplyId']
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()

        this.suppliesService.getSupplyById(this.supplyId).subscribe(supply => {
            this.navigationService.loadBarFinish()
            this.supply = supply
            this.navigationService.setTitle(`Inventario ${supply.fullName}`)
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage(error.error.message)
        })

        this.purchaseSuppliesService.getPurchaseSupplyItemsByPageSupply(
            this.pageIndex + 1,
            this.pageSize,
            this.supplyId,
        ).subscribe(purchaseSupplyItems => {
            this.purchaseSupplyItems = purchaseSupplyItems
        })

        this.purchaseSuppliesService.getPurchaseSupplyItemsQuantityBySupply(
            this.supplyId,
        ).subscribe(quantity => {
            this.purchaseSupplyItemsQuantity = quantity
        })

        this.salesService.getSaleSupplyItemsByPageSupply(
            this.pageIndex,
            this.pageSize,
            this.supplyId
        ).subscribe(saleSupplyItems => {
            this.saleSupplyItems = saleSupplyItems
        })

        this.salesService.getSaleSupplyItemsQuantityBySupply(
            this.supplyId,
        ).subscribe(quantity => {
            this.saleSupplyItemsQuantity = quantity
        })

        this.incidentSuppliesService.getIncidentSupplyItemsByPageSupply(
            this.pageIndex,
            this.pageSize,
            this.supplyId,
        ).subscribe(incidentSupplyItems => {
            this.incidentSupplyItems = incidentSupplyItems
        })

        this.incidentSuppliesService.getIncidentSupplyItemsQuantityBySupply(
            this.supplyId,
        ).subscribe(quantity => {
            this.incidentSupplyItemsQuantity = quantity
        })
    }

    onPurchaseSupplyDetail(purchaseId: string) {
        this.matDialog.open(DialogDetailPurchaseSuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: purchaseId,
        })
    }

    onSaleSupplyDetail(saleId: string) {
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: saleId,
        })
    }

    onIncidentSupplyDetail(incidentSupplyId: string) {
        this.matDialog.open(DialogDetailIncidentSuppliesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: incidentSupplyId,
        })
    }

}
