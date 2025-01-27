import { Component, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-sheet-add-stock',
    imports: [MaterialModule],
    templateUrl: './sheet-add-stock.component.html',
    styleUrl: './sheet-add-stock.component.sass'
})
export class SheetAddStockComponent {

    constructor(
        readonly bottomSheetRef: MatBottomSheetRef<SheetAddStockComponent>,
    ) { }

    onAddStock$: EventEmitter<void> = new EventEmitter()
    onRemoveStock$: EventEmitter<void> = new EventEmitter()

    handleAddStock() {
        return this.onAddStock$
    }

    handleRemoveStock() {
        return this.onRemoveStock$
    }

    onAddStock() {
        this.onAddStock$.next()
        this.bottomSheetRef.dismiss()
    }

    onRemoveStock() {
        this.onRemoveStock$.next()
        this.bottomSheetRef.dismiss()
    }

}