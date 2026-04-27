import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PrintService } from '../../print/print.service';
import { SalesService } from '../../sales/sales.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sheet-export-pdf',
    imports: [MaterialModule],
    templateUrl: './sheet-export-pdf.component.html',
    styleUrls: ['./sheet-export-pdf.component.sass']
})
export class SheetExportPdfComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly saleId: string,
        private readonly matBottomSheetRef: MatBottomSheetRef<SheetExportPdfComponent>,
        private readonly salesService: SalesService,
        private readonly printService: PrintService,
    ) { }

    onExportPdf(pageFormat: string): void {
        this.matBottomSheetRef.dismiss()
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            switch (pageFormat) {
                case 'A4':
                    this.printService.exportPdfA4Invoice(sale)
                    break
                case 'A5':
                    this.printService.exportPdfA5Invoice(sale)
                    break
                case '80MM':
                    this.printService.exportPdfTicket80mm(sale)
                    break
                case '58MM':
                    this.printService.exportPdfTicket58mm(sale)
                    break
                default:
                    break
            }
        })
    }
}
