import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { SalesService } from '../../sales/sales.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-credit-expiration',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-credit-expiration.component.html',
    styleUrls: ['./dialog-credit-expiration.component.sass']
})
export class DialogCreditExpirationComponent {

    private readonly saleId: any = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly dialogRef: MatDialogRef<DialogCreditExpirationComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        expirationAt: [new Date(), Validators.required],
    })
    isLoading: boolean = false

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
