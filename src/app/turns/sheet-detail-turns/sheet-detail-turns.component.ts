import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailSalesComponent } from '../../invoices/dialog-detail-sales/dialog-detail-sales.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sheet-detail-turns',
    imports: [MaterialModule],
    templateUrl: './sheet-detail-turns.component.html',
    styleUrl: './sheet-detail-turns.component.sass'
})
export class SheetDetailTurnsComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly saleId: string,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetDetailTurnsComponent>,
        private readonly matDialog: MatDialog,
    ) { }

    onChangeTurn$: EventEmitter<void> = new EventEmitter()
    
    onShowSale() {
        this.bottomSheetRef.dismiss()
        this.matDialog.open(DialogDetailSalesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: this.saleId,
        })
    }

    onChangeTurn() {
        this.bottomSheetRef.dismiss()
        this.onChangeTurn$.emit()
    }

    handleChangeTurn() {
        return this.onChangeTurn$
    }

}
