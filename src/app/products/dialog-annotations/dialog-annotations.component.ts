import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-annotations',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-annotations.component.html',
    styleUrls: ['./dialog-annotations.component.sass']
})
export class DialogAnnotationsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogAnnotationsComponent>,
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
