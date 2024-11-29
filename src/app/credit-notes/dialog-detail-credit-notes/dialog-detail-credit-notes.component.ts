import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { TicketModel } from '../../invoices/ticket.model';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { CdrNcModel } from '../cdr-nc.model';
import { CreditNoteItemModel } from '../credit-note-item.model';
import { CreditNoteModel } from '../credit-note.model';
import { CreditNotesService } from '../credit-notes.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-credit-notes',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-detail-credit-notes.component.html',
    styleUrls: ['./dialog-detail-credit-notes.component.sass']
})
export class DialogDetailCreditNotesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly creditNoteId: string,
        private readonly creditNotesService: CreditNotesService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly sanitizer: DomSanitizer,
    ) { }

    creditNote: CreditNoteModel | null = null
    creditNoteItems: CreditNoteItemModel[] = []
    cdr: CdrNcModel | null = null
    ticket: TicketModel | null = null
    user: UserModel = new UserModel()
    office: OfficeModel = new OfficeModel()
    business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.business = auth.business
            this.office = auth.office
        })

        this.creditNotesService.getCreditNoteById(this.creditNoteId).subscribe(creditNote => {
            this.creditNote = creditNote
            const { creditNoteItems, user, cdr } = creditNote
            this.creditNoteItems = creditNoteItems
            this.cdr = cdr
            this.user = user
        })
    }

    onGetCdr() {
        this.navigationService.loadBarStart()
        this.creditNotesService.getCdrByCreditNote(this.creditNoteId).subscribe({
            next: cdr => {
                this.navigationService.loadBarFinish()
                this.cdr = cdr
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url)
    }

}
