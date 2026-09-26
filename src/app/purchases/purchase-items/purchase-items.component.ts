import { Component, inject, signal } from '@angular/core'
import { Subscription } from 'rxjs'
import { IgvCode } from '../../sales/igv-code.enum'
import { CreatePurchaseItemModel } from '../create-purchase-item.model'
import { PurchasesService } from '../purchases.service'
import { MatDialog } from '@angular/material/dialog'
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-purchase-items',
    imports: [MaterialModule, CommonModule],
    templateUrl: './purchase-items.component.html',
    styleUrls: ['./purchase-items.component.sass']
})
export class PurchaseItemsComponent {

    private readonly purchasesService = inject(PurchasesService)
    private readonly matDialog = inject(MatDialog)

    $purchaseItems = signal<CreatePurchaseItemModel[]>([])
    $charge = signal(0)
    $countProducts = signal(0)
    igvCode = IgvCode

    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePurchaseItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePurchaseItems$ = this.purchasesService.handlePurchaseItems().subscribe(purchaseItems => {
            this.$purchaseItems.set(purchaseItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const purchaseItem of purchaseItems) {
                countProducts += purchaseItem.quantity
                if (purchaseItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectPurchaseItem(index: number) {
        this.matDialog.open(DialogPurchaseItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
