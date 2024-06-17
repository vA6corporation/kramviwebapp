import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreatePurchaseSupplyItemModel } from '../create-purchase-supply-item.model';
import { DialogPurchaseSupplyItemsComponent } from '../dialog-purchase-supply-items/dialog-purchase-supply-items.component';
import { PurchaseSuppliesService } from '../purchase-supplies.service';

@Component({
    selector: 'app-purchase-supply-items',
    templateUrl: './purchase-supply-items.component.html',
    styleUrls: ['./purchase-supply-items.component.sass']
})
export class PurchaseSupplyItemsComponent implements OnInit {

    constructor(
        private readonly purchaseSuppliesService: PurchaseSuppliesService,
        private readonly matDialog: MatDialog,
    ) { }

    purchaseSupplyItems$: Subscription = new Subscription()
    purchaseSupplyItems: CreatePurchaseSupplyItemModel[] = []
    charge: number = 0

    ngOnInit(): void {
        this.purchaseSupplyItems$ = this.purchaseSuppliesService.getPurchaseSupplyItems().subscribe(purchaseSupplyItems => {
            this.purchaseSupplyItems = purchaseSupplyItems
            this.charge = 0
            for (const purchaseSupplyItem of this.purchaseSupplyItems) {
                if (purchaseSupplyItem.igvCode !== '11') {
                    this.charge += purchaseSupplyItem.cost * purchaseSupplyItem.quantity
                }
            }
        })
    }

    onClickPurchaseItem(index: number) {
        this.matDialog.open(DialogPurchaseSupplyItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

    ngOnDestroy() {
        this.purchaseSupplyItems$.unsubscribe()
    }
}
