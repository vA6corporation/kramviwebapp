import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseModel } from '../expense.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-edit-expenses',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-expenses.component.html',
    styleUrls: ['./dialog-edit-expenses.component.sass']
})
export class DialogEditExpensesComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly expense: ExpenseModel,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogEditExpensesComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        turnId: this.expense.turnId,
        concept: [this.expense.concept, Validators.required],
        charge: [this.expense.charge, Validators.required],
    })

    private onDeleteExpense$: EventEmitter<void> = new EventEmitter()

    ngOnInit(): void {
    }

    onDeleteExpense() {
        this.onDeleteExpense$.emit()
    }

    handleDeleteExpense() {
        return this.onDeleteExpense$.asObservable()
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

}
