import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { SalesService } from '../../sales/sales.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-send-email',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-send-email.component.html',
    styleUrls: ['./dialog-send-email.component.sass']
})
export class DialogSendEmailComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleId: string,
        private readonly salesService: SalesService,
        private readonly matDialogRef: MatDialogRef<DialogSendEmailComponent>,
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        email: [{ value: null, disabled: true }, [Validators.required, Validators.email]]
    })
    isLoading = true

    ngOnInit(): void {
        this.salesService.getSaleById(this.saleId).subscribe({
            next: sale => {
                if (sale.customer) {
                    this.formGroup.patchValue(sale.customer)
                }
                this.formGroup.get('email')?.enable()
                this.isLoading = false
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
                this.formGroup.get('email')?.enable()
                this.isLoading = false
            }
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.matDialogRef.close()
            const { email } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.salesService.sendEmail(email, this.saleId).subscribe({
                next: () => {
                    this.navigationService.showMessage('Enviado correctamente')
                    this.navigationService.loadBarFinish()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
