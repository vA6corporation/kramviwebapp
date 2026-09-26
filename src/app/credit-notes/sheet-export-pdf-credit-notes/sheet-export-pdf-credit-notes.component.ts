import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { CreditNotesService } from '../credit-notes.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sheet-export-pdf-credit-notes',
    imports: [MaterialModule],
    templateUrl: './sheet-export-pdf-credit-notes.component.html',
    styleUrls: ['./sheet-export-pdf-credit-notes.component.sass']
})
export class SheetExportPdfCreditNotesComponent {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA)
        private readonly creditNoteId: any,
        private readonly navigationService: NavigationService,
        private readonly matBottomSheetRef: MatBottomSheetRef<SheetExportPdfCreditNotesComponent>,
        private readonly creditNotesService: CreditNotesService,
        private readonly printService: PrintService,
    ) { }

    onExportPdfA4() {
        this.matBottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
            this.navigationService.loadBarFinish()
            this.printService.exportPdfA4CreditNote(creditNote)
        })
    }

    onExportPdfTicket() {
        this.matBottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
            this.navigationService.loadBarFinish()
            this.printService.exportPdfTicketCreditNote(creditNote)
        })
    }

}
