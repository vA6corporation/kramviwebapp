import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogPurchaseOrderItemsComponent } from '../dialog-purchase-order-items/dialog-purchase-order-items.component';
import { PurchaseOrderItemModel } from '../purchase-order-item.model';
import { PurchaseOrdersService } from '../purchase-orders.service';
import { IgvType } from '../../products/igv-type.enum';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-purchase-order-items',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './purchase-order-items.component.html',
    styleUrls: ['./purchase-order-items.component.sass']
})
export class PurchaseOrderItemsComponent {

    constructor(
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly matDialog: MatDialog,
    ) { }

    igvType = IgvType
    purchaseOrderItems$: Subscription = new Subscription()
    purchaseOrderItems: PurchaseOrderItemModel[] = []
    charge: number = 0

    ngOnInit(): void {
        this.purchaseOrderItems$ = this.purchaseOrdersService.getPurchaseOrderItems().subscribe(purchaseOrderItems => {
            this.purchaseOrderItems = purchaseOrderItems
            this.charge = 0
            for (const purchaseOrderItem of this.purchaseOrderItems) {
                if (purchaseOrderItem.igvCode !== '11') {
                    this.charge += purchaseOrderItem.cost * purchaseOrderItem.quantity
                }
            }
        })
    }

    onSelectPurchaseOrderItem(index: number) {
        this.matDialog.open(DialogPurchaseOrderItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

    ngOnDestroy() {
        this.purchaseOrderItems$.unsubscribe()
    }

}
