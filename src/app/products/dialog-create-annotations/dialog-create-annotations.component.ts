import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-annotations',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-annotations.component.html',
    styleUrl: './dialog-create-annotations.component.sass'
})
export class DialogCreateAnnotationsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogCreateAnnotationsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        annotation: [null, Validators.required],
    })


    onSubmit() {
        if (this.formGroup.valid) {
            const { annotation } = this.formGroup.value
            this.dialogRef.close(annotation)
        }
    }

}
