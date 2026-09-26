import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { DialogPurchaseOrderItemsComponent } from '../dialog-purchase-order-items/dialog-purchase-order-items.component'
import { PurchaseOrderItemModel } from '../purchase-order-item.model'
import { PurchaseOrdersService } from '../purchase-orders.service'
import { MaterialModule } from '../../material.module'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-purchase-order-items',
    imports: [MaterialModule],
    templateUrl: './purchase-order-items.component.html',
    styleUrls: ['./purchase-order-items.component.sass']
})
export class PurchaseOrderItemsComponent {

    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly matDialog = inject(MatDialog)

    purchaseOrderItems: PurchaseOrderItemModel[] = []
    $charge = signal(0)
    $countProducts = signal(0)
    igvCode = IgvCode

    handlePurchaseOrderItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePurchaseOrderItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePurchaseOrderItems$ = this.purchaseOrdersService.handlePurchaseOrderItems().subscribe(purchaseOrderItems => {
            this.purchaseOrderItems = purchaseOrderItems
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const purchaseOrderItem of this.purchaseOrderItems) {
                countProducts += purchaseOrderItem.quantity
                if (purchaseOrderItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += purchaseOrderItem.cost * purchaseOrderItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectPurchaseOrderItem(index: number) {
        this.matDialog.open(DialogPurchaseOrderItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
