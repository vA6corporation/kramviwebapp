import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model';
import { CreditNotesService } from '../credit-notes.service';

@Component({
    selector: 'app-dialog-credit-note-items',
    templateUrl: './dialog-credit-note-items.component.html',
    styleUrls: ['./dialog-credit-note-items.component.sass']
})
export class DialogCreditNoteItemsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly creditNotesService: CreditNotesService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogCreditNoteItemsComponent>,
    ) { }

    creditNoteItem: CreateCreditNoteItemModel = this.creditNotesService.getCreditNoteItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.creditNoteItem.quantity, Validators.required],
        price: [this.creditNoteItem.price, Validators.required],
        observations: this.creditNoteItem.observations,
        isBonus: this.creditNoteItem.igvCode === '11' ? true : false,
    })
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.creditNoteItem.price * quantity).toFixed(2))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.creditNoteItem.price
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, observations, isBonus } = this.formGroup.value
            this.creditNoteItem.quantity = quantity
            this.creditNoteItem.price = price
            this.creditNoteItem.observations = observations
            if (isBonus) {
                this.creditNoteItem.igvCode = '11'
            } else {
                this.creditNoteItem.igvCode = this.creditNoteItem.preIgvCode
            }
            this.creditNotesService.updateCreditNoteItem(this.index, this.creditNoteItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.creditNotesService.removeCreditNoteItem(this.index)
    }

}
