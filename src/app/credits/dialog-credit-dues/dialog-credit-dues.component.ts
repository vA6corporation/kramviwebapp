import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-dialog-credit-dues',
    templateUrl: './dialog-credit-dues.component.html',
    styleUrls: ['./dialog-credit-dues.component.sass']
})
export class DialogCreditDuesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleId: string,
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly dialogRef: MatDialogRef<DialogCreditDuesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        dues: ['', Validators.required],
    })
    isLoading: boolean = false

    ngOnInit(): void { }

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
