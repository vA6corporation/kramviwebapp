import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CreditNoteModel } from '../credit-note.model';
import { CreditNotesService } from '../credit-notes.service';

@Component({
    selector: 'app-dialog-admin-credit-notes',
    templateUrl: './dialog-admin-credit-notes.component.html',
    styleUrls: ['./dialog-admin-credit-notes.component.sass']
})
export class DialogAdminCreditNotesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly creditNoteId: string,
        private readonly authService: AuthService,
        private readonly creditNotesService: CreditNotesService,
        private readonly navigationService: NavigationService,
        private readonly matDialogRef: MatDialogRef<DialogAdminCreditNotesComponent>,
        private readonly formBuilder: FormBuilder
    ) { }

    office: OfficeModel | null = null
    creditNote: CreditNoteModel | null = null

    private onUpdate$: EventEmitter<void> = new EventEmitter()
    private handleAuth$: Subscription = new Subscription()

    formGroup: FormGroup = this.formBuilder.group({
        invoiceNumber: ['', Validators.required],
    })

    formDate: FormGroup = this.formBuilder.group({
        emitionAt: new Date(),
    })

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })
        this.fetchData()
    }

    handleUpdate() {
        return this.onUpdate$.asObservable()
    }

    onDeleteCreditNote() {
        this.creditNotesService.deleteById(this.creditNoteId).subscribe(() => {
            this.onUpdate$.next()
            this.matDialogRef.close()
        })
    }

    fetchData() {
        this.creditNotesService.getById(this.creditNoteId).subscribe(creditNote => {
            this.creditNote = creditNote
            this.formGroup.patchValue(creditNote)
        })
    }

    onSubmitDate() {
        if (this.creditNote) {
            Object.assign(this.creditNote, this.formDate.value)
            this.creditNotesService.updateDate(this.creditNote, this.creditNoteId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

    onSubmit() {
        if (this.creditNote) {
            Object.assign(this.creditNote, this.formGroup.value)
            this.creditNotesService.updateCreditNote(this.creditNoteId, this.creditNote).subscribe({
                next: () => {
                    this.onUpdate$.next()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.onUpdate$.emit()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
