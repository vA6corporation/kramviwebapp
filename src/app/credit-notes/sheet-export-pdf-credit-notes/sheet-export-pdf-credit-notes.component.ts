import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { CreditNotesService } from '../credit-notes.service';

@Component({
  selector: 'app-sheet-export-pdf-credit-notes',
  templateUrl: './sheet-export-pdf-credit-notes.component.html',
  styleUrls: ['./sheet-export-pdf-credit-notes.component.sass']
})
export class SheetExportPdfCreditNotesComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private readonly creditNoteId: string,
    private readonly navigationService: NavigationService,
    private readonly bottomSheetRef: MatBottomSheetRef<SheetExportPdfCreditNotesComponent>,
    private readonly creditNotesService: CreditNotesService,
    private readonly printService: PrintService,
  ) { }

  ngOnInit(): void {
  }

  onExportPdfA4() {
    this.bottomSheetRef.dismiss();
    this.navigationService.loadBarStart();
    this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
      this.navigationService.loadBarFinish();
      this.printService.exportPdfA4CreditNote(creditNote);
    });
  }

  onExportPdfTicket() {
    this.bottomSheetRef.dismiss();
    this.navigationService.loadBarStart();
    this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
      this.navigationService.loadBarFinish();
      this.printService.exportPdfTicketCreditNote(creditNote);
    });
  }

}
