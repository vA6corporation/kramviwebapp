import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component';
import { PurchasesService } from '../purchases.service';

@Component({
    selector: 'app-sheet-purchase-items',
    templateUrl: './sheet-purchase-items.component.html',
    styleUrls: ['./sheet-purchase-items.component.sass'],
})
export class SheetPurchaseItemsComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly index: number,
        private readonly matBottomSheetRef: MatBottomSheetRef<SheetPurchaseItemsComponent>,
        private readonly purchasesService: PurchasesService,
        private readonly matDialog: MatDialog
    ) { }

    onDeletePurchaseItem(): void {
        this.matBottomSheetRef.dismiss()
        this.purchasesService.removePurchaseItem(this.index)
    }

    onEditPurchaseItem(): void {
        this.matBottomSheetRef.dismiss()
        this.matDialog.open(DialogPurchaseItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.index,
        })
    }

}
