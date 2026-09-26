import { Component, EventEmitter, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ExpenseModel } from '../expense.model'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-edit-expenses',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-expenses.component.html',
    styleUrls: ['./dialog-edit-expenses.component.sass']
})
export class DialogEditExpensesComponent {

    private readonly expense: ExpenseModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogEditExpensesComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        turnId: this.expense.turnId,
        concept: [this.expense.concept, Validators.required],
        charge: [this.expense.charge, Validators.required],
    })

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

}
