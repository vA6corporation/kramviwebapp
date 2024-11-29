import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-delete-sale',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-delete-sale.component.html',
    styleUrls: ['./dialog-delete-sale.component.sass']
})
export class DialogDeleteSaleComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogDeleteSaleComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        deletedReason: [null, Validators.required]
    })

    onSubmit() {
        if (this.formGroup.valid) {
            const { deletedReason } = this.formGroup.value
            this.dialogRef.close(deletedReason)
        }
    }

}
