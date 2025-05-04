import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-categories',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-categories.component.html',
    styleUrls: ['./dialog-create-categories.component.sass']
})
export class DialogCreateCategoriesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogCreateCategoriesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        color: ['#90EE90', Validators.required]
    })

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

}
