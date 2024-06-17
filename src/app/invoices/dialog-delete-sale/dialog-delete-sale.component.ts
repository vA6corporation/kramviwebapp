import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-delete-sale',
    templateUrl: './dialog-delete-sale.component.html',
    styleUrls: ['./dialog-delete-sale.component.sass']
})
export class DialogDeleteSaleComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogDeleteSaleComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        deletedReason: [null, Validators.required]
    });

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const { deletedReason } = this.formGroup.value;
            this.dialogRef.close(deletedReason);
        }
    }

}
