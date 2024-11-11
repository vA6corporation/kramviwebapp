import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { CreditNotesService } from '../credit-notes.service';

@Component({
  selector: 'app-sheet-print-credit-notes',
  templateUrl: './sheet-print-credit-notes.component.html',
  styleUrls: ['./sheet-print-credit-notes.component.sass']
})
export class SheetPrintCreditNotesComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private readonly creditNoteId: string,
    private readonly navigationService: NavigationService,
    private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintCreditNotesComponent>,
    private readonly creditNotesService: CreditNotesService,
    private readonly printService: PrintService,
  ) { }

  ngOnInit(): void {
  }

  onPrintA4() {
    this.bottomSheetRef.dismiss();
    this.navigationService.loadBarStart();
    this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
      this.navigationService.loadBarFinish();
      this.printService.printA4CreditNote(creditNote);
    }, (error: HttpErrorResponse) => {
      this.navigationService.showMessage(error.error.message);
    });
  }

  onPrintTicket() {
    this.bottomSheetRef.dismiss();
    this.navigationService.loadBarStart();
    this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
      this.navigationService.loadBarFinish();
      this.printService.printTicketCreditNote(creditNote);
    }, (error: HttpErrorResponse) => {
      this.navigationService.showMessage(error.error.message);
    });
  }

}
