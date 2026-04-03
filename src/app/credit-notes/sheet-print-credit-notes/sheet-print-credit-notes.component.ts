import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { CreditNotesService } from '../credit-notes.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-sheet-print-credit-notes',
    imports: [MaterialModule],
    templateUrl: './sheet-print-credit-notes.component.html',
    styleUrls: ['./sheet-print-credit-notes.component.sass']
})
export class SheetPrintCreditNotesComponent {

    private readonly creditNoteId: number = inject(MAT_BOTTOM_SHEET_DATA)
    private readonly navigationService = inject(NavigationService)
    private readonly bottomSheetRef: MatBottomSheetRef<SheetPrintCreditNotesComponent> = inject(MatBottomSheetRef)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly printService = inject(PrintService)

    onPrintA4() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe({
            next: creditNote => {
                this.navigationService.loadBarFinish()
                this.printService.printA4CreditNote(creditNote)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onPrintTicket() {
        this.bottomSheetRef.dismiss()
        this.navigationService.loadBarStart()
        this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe({
            next: creditNote => {
                this.navigationService.loadBarFinish()
                this.printService.printTicketCreditNote(creditNote)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

}
