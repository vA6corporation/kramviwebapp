import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model'
import { CreditNotesService } from '../credit-notes.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-credit-note-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-credit-note-items.component.html',
    styleUrls: ['./dialog-credit-note-items.component.sass']
})
export class DialogCreditNoteItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly creditNotesService = inject(CreditNotesService)
    private readonly authService = inject(AuthService)
    private readonly dialogRef: MatDialogRef<DialogCreditNoteItemsComponent> = inject(MatDialogRef)

    creditNoteItem: CreateCreditNoteItemModel = this.creditNotesService.getCreditNoteItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.creditNoteItem.quantity, Validators.required],
        price: [this.creditNoteItem.price, Validators.required],
        observation: this.creditNoteItem.observation,
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
        return Number((this.creditNoteItem.price * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.creditNoteItem.price
        this.formGroup.get('quantity')?.patchValue(Number(subTotal.toFixed(4)))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, observation, isBonus } = this.formGroup.value
            this.creditNoteItem.quantity = quantity
            this.creditNoteItem.price = price
            this.creditNoteItem.observation = observation
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
