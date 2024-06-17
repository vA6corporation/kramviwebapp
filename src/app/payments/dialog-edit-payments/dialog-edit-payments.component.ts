import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentModel } from '../payment.model';

@Component({
    selector: 'app-dialog-edit-payments',
    templateUrl: './dialog-edit-payments.component.html',
    styleUrls: ['./dialog-edit-payments.component.sass']
})
export class DialogEditPaymentsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly payment: PaymentModel,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogEditPaymentsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        charge: [this.payment.charge, Validators.required],
        paymentMethodId: [this.payment.paymentMethodId, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

}
