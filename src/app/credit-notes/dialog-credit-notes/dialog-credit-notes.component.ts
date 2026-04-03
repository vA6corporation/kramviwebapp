import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { PrintService } from '../../print/print.service'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'
import { CreditNoteModel } from '../credit-note.model'
import { CreditNotesService } from '../credit-notes.service'

@Component({
    selector: 'app-dialog-credit-notes',
    imports: [MaterialModule, RouterModule],
    templateUrl: './dialog-credit-notes.component.html',
    styleUrls: ['./dialog-credit-notes.component.sass']
})
export class DialogCreditNotesComponent {

    readonly saleId: number = inject(MAT_DIALOG_DATA)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly navigationService = inject(NavigationService)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)
    private readonly printService = inject(PrintService)
    private readonly dialogRef: MatDialogRef<DialogCreditNotesComponent> = inject(MatDialogRef)

    creditNotes: CreditNoteModel[] = []
    isLoading: boolean = true
    office: OfficeModel = new OfficeModel()
    private sale: SaleModel | null = null

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.creditNotesService.getCreditNotesBySale(this.saleId).subscribe(creditNotes => {
            this.creditNotes = creditNotes
        })

        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.sale = sale
            if (this.sale.deletedAt !== null) {
                this.navigationService.showMessage('El comprobante a sido anulado')
            } else {
                if (this.sale.cdr && this.sale.cdr.sunatCode === '0') {
                    this.isLoading = false
                } else {
                    this.navigationService.showMessage('El comprobante no ha sido enviado a sunat')
                }
            }
        })

    }

    onPrintCreditNote(creditNoteId: any) {
        this.dialogRef.close()
        this.creditNotesService.getCreditNoteById(creditNoteId).subscribe(creditNote => {
            this.printService.printA4CreditNote(creditNote)
        })
    }
}
