import { Component, EventEmitter, inject } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { DialogDetailSalesComponent } from '../../sales/dialog-detail-sales/dialog-detail-sales.component'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-sheet-detail-turns',
    imports: [MaterialModule],
    templateUrl: './sheet-detail-turns.component.html',
    styleUrl: './sheet-detail-turns.component.sass'
})
export class SheetDetailTurnsComponent {

    private readonly saleId: any = inject(MAT_BOTTOM_SHEET_DATA)
    private readonly matBottomSheetRef: MatBottomSheetRef<SheetDetailTurnsComponent> = inject(MatBottomSheetRef)
    private readonly matDialog = inject(MatDialog)

    onChangeTurn$: EventEmitter<void> = new EventEmitter()

    onShowSale() {
        this.matBottomSheetRef.dismiss()
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.saleId,
        })
    }

    onChangeTurn() {
        this.matBottomSheetRef.dismiss()
        this.onChangeTurn$.emit()
    }

    handleChangeTurn() {
        return this.onChangeTurn$
    }

}
