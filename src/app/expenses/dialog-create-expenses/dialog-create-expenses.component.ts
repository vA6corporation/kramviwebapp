import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-expenses',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-expenses.component.html',
    styleUrl: './dialog-create-expenses.component.sass'
})
export class DialogCreateExpensesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly turnId: string,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogCreateExpensesComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        concept: ['', Validators.required],
        charge: ['', Validators.required],
    })

    onSubmit() {
        if (this.formGroup.valid) {
            const expense = this.formGroup.value
            expense.turnId = this.turnId
            this.dialogRef.close(expense)
        }
    }

}
