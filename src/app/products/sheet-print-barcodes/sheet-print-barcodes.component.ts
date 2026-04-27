import { Component, inject } from '@angular/core'
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet'
import { ProductModel } from '../product.model'
import { PrintService } from '../../print/print.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-sheet-print-barcodes',
    imports: [MaterialModule],
    templateUrl: './sheet-print-barcodes.component.html',
    styleUrls: ['./sheet-print-barcodes.component.sass']
})
export class SheetPrintBarcodesComponent {

    private readonly products: ProductModel[] = inject(MAT_BOTTOM_SHEET_DATA)
    private readonly printService = inject(PrintService)
    private readonly matBottomSheetRef: MatBottomSheetRef<SheetPrintBarcodesComponent> = inject(MatBottomSheetRef)

    onPrintBarcodes110x30mm() {
        this.printService.printBarcodes110x30mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes105x25mm() {
        this.printService.printBarcodes105x25mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes105x25mmTwo() {
        this.printService.printBarcodes105x25mmTwo(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes70x30mm() {
        this.printService.printBarcodes70x30mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes70x30mmTwo() {
        this.printService.printBarcodes70x30mmTwo(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes60x30mm() {
        this.printService.printBarcodes60x30mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes50x25mm() {
        this.printService.printBarcodes50x25mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes50x25mmTwo() {
        this.printService.printBarcodes50x25mmTwo(this.products)
        this.matBottomSheetRef.dismiss()
    }

    onPrintBarcodes30x20mm() {
        this.printService.printBarcodes30x20mm(this.products)
        this.matBottomSheetRef.dismiss()
    }

}
