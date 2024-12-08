import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { ProformasService } from '../proformas.service';
import { SheetPrintProformasComponent } from '../sheet-print-proformas/sheet-print-proformas.component';

@Component({
    selector: 'app-sheet-export-pdf-proformas',
    imports: [MaterialModule],
    templateUrl: './sheet-export-pdf-proformas.component.html',
    styleUrls: ['./sheet-export-pdf-proformas.component.sass']
})
export class SheetExportPdfProformasComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly proformaId: string,
        private readonly navigationService: NavigationService,
        private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintProformasComponent>,
        private readonly proformasService: ProformasService,
        private readonly printService: PrintService,
    ) { }

    onExportPdfTicket() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.navigationService.loadBarFinish()
            this.printService.exportPdfTicketProforma(proforma)
        })
    }

    onExportPdfA4() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.navigationService.loadBarFinish()
            this.printService.exportPdfA4Proforma(proforma)
        })
    }

    onExportPdfA4Image() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            this.navigationService.loadBarFinish()
            this.printService.exportPdfA4ProformaImage(proforma)
        })
    }

}
