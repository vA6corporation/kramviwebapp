import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';

export interface DialogPaymentData {
    turnId: string
    saleId: string
}

@Component({
    selector: 'app-dialog-payment',
    templateUrl: './dialog-payment.component.html',
    styleUrls: ['./dialog-payment.component.sass']
})
export class DialogPaymentComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogPaymentData,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogPaymentComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        turnId: this.data.turnId,
        saleId: this.data.saleId,
        paymentMethodId: '',
        observations: '',
        charge: [null, Validators.required],
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
