import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SalesService } from '../../sales/sales.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PrintService } from '../../print/print.service';

@Component({
    selector: 'app-sheet-print',
    templateUrl: './sheet-print.component.html',
    styleUrls: ['./sheet-print.component.sass']
})
export class SheetPrintComponent implements OnInit {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly saleId: string,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintComponent>,
        private readonly salesService: SalesService,
        private readonly printService: PrintService,
    ) { }

    ngOnInit(): void {
    }

    onPrint(pageFormat: string): void {
        this.bottomSheetRef.dismiss();
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            switch (pageFormat) {
                case 'a4':
                    this.printService.printA4Invoice(sale);
                    break;
                case 'a5':
                    this.printService.printA5Invoice(sale);
                    break;
                case 'ticket80mm':
                    this.printService.printTicket80mm(sale);
                    break;
                case 'ticket58mm':
                    this.printService.printTicket58mm(sale);
                    break;
                default:
                    break;
            }
        });
    }

}