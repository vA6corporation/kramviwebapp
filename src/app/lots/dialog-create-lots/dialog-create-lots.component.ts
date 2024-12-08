import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-lots',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-lots.component.html',
    styleUrl: './dialog-create-lots.component.sass'
})
export class DialogCreateLotsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialogRef<DialogCreateLotsComponent>
    ) { }

    formGroup = this.formBuilder.group({
        lotNumber: ['', Validators.required],
        expirationAt: [null, Validators.required],
        stock: null,
    })
    isLoading = false

    onGenerateEan13() {
        let result = ''
        let result2 = ''
        const characters = '0123456789'
        const charactersLength = characters.length
        for (let i = 0; i < 12; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        for (let i = 0; i < 4; i++) {
            result2 += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        this.formGroup.patchValue({ lotNumber: `7${result}` })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.matDialog.close(this.formGroup.value)
        }
    }

}
