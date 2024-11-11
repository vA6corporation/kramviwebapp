import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PrintService } from '../../print/print.service';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-sheet-export-pdf',
    templateUrl: './sheet-export-pdf.component.html',
    styleUrls: ['./sheet-export-pdf.component.sass']
})
export class SheetExportPdfComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly saleId: string,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetExportPdfComponent>,
        private readonly salesService: SalesService,
        private readonly printService: PrintService,
    ) { }

    onExportPdf(pageFormat: string): void {
        this.bottomSheetRef.dismiss();
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            switch (pageFormat) {
                case 'a4':
                    this.printService.exportPdfA4Invoice(sale);
                    break;
                case 'a5':
                    this.printService.exportPdfA5Invoice(sale);
                    break;
                case 'ticket80mm':
                    this.printService.exportPdfTicket80mm(sale);
                    break;
                case 'ticket58mm':
                    this.printService.exportPdfTicket58mm(sale);
                    break;
                default:
                    break;
            }
        });
    }
}
