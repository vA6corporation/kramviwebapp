import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ProductModel } from '../product.model';
import { PrintService } from '../../print/print.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sheet-print-barcodes',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './sheet-print-barcodes.component.html',
    styleUrls: ['./sheet-print-barcodes.component.sass']
})
export class SheetPrintBarcodesComponent implements OnInit {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly products: ProductModel[],
        private readonly printService: PrintService,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintBarcodesComponent>,
    ) { }

    ngOnInit(): void {
    }

    onPrintBarcodes110x30mm() {
        this.printService.printBarcodes110x30mm(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes105x25mm() {
        this.printService.printBarcodes105x25mm(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes105x25mmTwo() {
        this.printService.printBarcodes105x25mmTwo(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes70x30mm() {
        this.printService.printBarcodes70x30mm(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes70x30mmTwo() {
        this.printService.printBarcodes70x30mmTwo(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes60x30mm() {
        this.printService.printBarcodes60x30mm(this.products)
        this.bottomSheetRef.dismiss()
    }

    onPrintBarcodes50x25mm() {
        this.printService.printBarcodes50x25mm(this.products)
        this.bottomSheetRef.dismiss()
    }

}
