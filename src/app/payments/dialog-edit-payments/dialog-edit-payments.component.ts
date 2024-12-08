import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentModel } from '../payment.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-edit-payments',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-payments.component.html',
    styleUrls: ['./dialog-edit-payments.component.sass']
})
export class DialogEditPaymentsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly payment: PaymentModel,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogEditPaymentsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: '',
        charge: [null, Validators.required],
        paymentMethodId: [null, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.formGroup.patchValue(this.payment)
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
