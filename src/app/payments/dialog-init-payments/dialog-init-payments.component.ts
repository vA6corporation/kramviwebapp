import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { MaterialModule } from '../../material.module';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';

@Component({
    selector: 'app-dialog-init-payments',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, ],
    templateUrl: './dialog-init-payments.component.html',
    styleUrls: ['./dialog-init-payments.component.sass']
})
export class DialogInitPaymentsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly turnId: string,
        private readonly formBuilder: FormBuilder,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogInitPaymentsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        charge: [null, Validators.required],
        paymentMethodId: '',
        turnId: this.turnId,
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id })
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onCancel() {
        this.dialogRef.close()
    }

}
