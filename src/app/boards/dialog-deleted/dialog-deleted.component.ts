import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-deleted',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-deleted.component.html',
    styleUrls: ['./dialog-deleted.component.sass']
})
export class DialogDeletedComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogDeletedComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: [null, Validators.required]
    })
    isLoading: boolean = false

    ngOnInit(): void {

    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value.observations)
        }
    }

}
