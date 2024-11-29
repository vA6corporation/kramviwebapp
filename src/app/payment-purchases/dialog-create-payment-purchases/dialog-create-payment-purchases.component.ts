import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';

@Component({
  selector: 'app-dialog-create-payment-purchases',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './dialog-create-payment-purchases.component.html',
  styleUrl: './dialog-create-payment-purchases.component.sass'
})
export class DialogCreatePaymentPurchasesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly purchaseId: string,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogCreatePaymentPurchasesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: '',
        observations: '',
        purchaseId: this.purchaseId,
        charge: [null, Validators.required],
    })
    isLoading: boolean = false
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
