import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-create-annotations',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-annotations.component.html',
    styleUrl: './dialog-create-annotations.component.sass'
})
export class DialogCreateAnnotationsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogCreateAnnotationsComponent> = inject(MatDialogRef)

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
