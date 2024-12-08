import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';

export interface DialogCreatePaymentData {
    turnId: string
    saleId: string
}

@Component({
    selector: 'app-dialog-create-payments',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-payments.component.html',
    styleUrl: './dialog-create-payments.component.sass'
})
export class DialogCreatePaymentsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogCreatePaymentData,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogCreatePaymentsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        turnId: this.data.turnId,
        saleId: this.data.saleId,
        paymentMethodId: '',
        observations: '',
        charge: ['', Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.dialogRef.disableClose = true

        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

}
