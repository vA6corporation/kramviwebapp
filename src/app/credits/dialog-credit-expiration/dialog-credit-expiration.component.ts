import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SalesService } from '../../sales/sales.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-credit-expiration',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-credit-expiration.component.html',
    styleUrls: ['./dialog-credit-expiration.component.sass']
})
export class DialogCreditExpirationComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleId: string,
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly dialogRef: MatDialogRef<DialogCreditExpirationComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        expirationAt: [new Date(), Validators.required],
    })
    isLoading: boolean = false

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            const { expirationAt } = this.formGroup.value
            this.salesService.updateExpirationAt(this.saleId, expirationAt).subscribe(() => {
                this.dialogRef.close(true)
            })
        }
    }
}
