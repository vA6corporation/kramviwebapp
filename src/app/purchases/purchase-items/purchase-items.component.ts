import { Component } from '@angular/core'
import { Subscription } from 'rxjs';
import { IgvType } from '../../products/igv-type.enum';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { PurchasesService } from '../purchases.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-purchase-items',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './purchase-items.component.html',
    styleUrls: ['./purchase-items.component.sass']
})
export class PurchaseItemsComponent {

    constructor(
        private readonly purchasesService: PurchasesService,
        private readonly matDialog: MatDialog,
    ) { }

    igvType = IgvType
    purchaseItems: CreatePurchaseItemModel[] = []
    charge: number = 0

    private handlePurchaseItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePurchaseItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePurchaseItems$ = this.purchasesService.handlePurchaseItems().subscribe(purchaseItems => {
            this.purchaseItems = purchaseItems
            this.charge = 0
            for (const purchaseItem of this.purchaseItems) {
                if (purchaseItem.igvCode !== '11') {
                    this.charge += purchaseItem.cost * purchaseItem.quantity
                }
            }
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
