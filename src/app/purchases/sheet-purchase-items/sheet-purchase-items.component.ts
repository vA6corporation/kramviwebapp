import { Component, inject } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component'
import { PurchasesService } from '../purchases.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-sheet-purchase-items',
    imports: [MaterialModule],
    templateUrl: './sheet-purchase-items.component.html',
    styleUrls: ['./sheet-purchase-items.component.sass'],
})
export class SheetPurchaseItemsComponent {

    private readonly index: number = inject(MAT_BOTTOM_SHEET_DATA)
    private readonly matBottomSheetRef: MatBottomSheetRef<SheetPurchaseItemsComponent> = inject(MatBottomSheetRef)
    private readonly purchasesService = inject(PurchasesService)
    private readonly matDialog = inject(MatDialog)

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
