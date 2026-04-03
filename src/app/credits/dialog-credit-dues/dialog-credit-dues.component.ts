import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SalesService } from '../../sales/sales.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-credit-dues',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-credit-dues.component.html',
    styleUrls: ['./dialog-credit-dues.component.sass']
})
export class DialogCreditDuesComponent {

    private readonly saleId: any = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly salesService = inject(SalesService)
    private readonly dialogRef: MatDialogRef<DialogCreditDuesComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        dues: ['', Validators.required],
    })
    isLoading: boolean = false

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            const { dues } = this.formGroup.value
            this.salesService.updateDues(this.saleId, dues).subscribe({
                next: () => {
                    this.dialogRef.close(true)
                }, error: (error: HttpErrorResponse) => {
                    console.log(error.error.message)
                }
            })
        }
    }

}
