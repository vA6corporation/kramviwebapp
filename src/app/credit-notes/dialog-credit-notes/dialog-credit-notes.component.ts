import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PrintService } from '../../print/print.service';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { CreditNoteModel } from '../credit-note.model';
import { CreditNotesService } from '../credit-notes.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dialog-credit-notes',
    imports: [MaterialModule, RouterModule],
    templateUrl: './dialog-credit-notes.component.html',
    styleUrls: ['./dialog-credit-notes.component.sass']
})
export class DialogCreditNotesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly saleId: string,
        private readonly creditNotesService: CreditNotesService,
        private readonly navigationService: NavigationService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly printService: PrintService,
        private readonly dialogRef: MatDialogRef<DialogCreditNotesComponent>
    ) { }

    creditNotes: CreditNoteModel[] = []
    office: OfficeModel = new OfficeModel()
    setting: SettingModel = new SettingModel()
    isLoading: boolean = true
    private sale: SaleModel | null = null

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
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

    onPrintCreditNote(creditNoteId: string) {
        this.dialogRef.close()
        this.creditNotesService.getCreditNoteById(creditNoteId).subscribe(creditNote => {
            this.printService.printA4CreditNote(creditNote)
        })
    }
}
