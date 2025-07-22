import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreatePaymentModel } from '../create-payment.model';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentModel } from '../payment.model';
import { MaterialModule } from '../../material.module';

export interface DialogSplitPaymentsData {
    turnId: string
    charge: number
    payments: CreatePaymentModel[]
}

@Component({
    selector: 'app-dialog-split-payments',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-split-payments.component.html',
    styleUrls: ['./dialog-split-payments.component.sass']
})
export class DialogSplitPaymentsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogSplitPaymentsData,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly dialogRef: MatDialogRef<DialogSplitPaymentsComponent>,
    ) { }

    formArray: FormArray = this.formBuilder.array([])
    formGroup: FormGroup = this.formBuilder.group({
        payments: this.formArray,
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            if (this.data.payments.length) {
                for (const payment of this.data.payments) {
                    const formGroupPayment = this.formBuilder.group({
                        turnId: this.data.turnId,
                        paymentMethodId: payment.paymentMethodId,
                        charge: [payment.charge, Validators.required],
                    })
                    this.formArray.push(formGroupPayment)
                }
            } else {
                const formGroupOne = this.formBuilder.group({
                    turnId: this.data.turnId,
                    paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id,
                    charge: [null, Validators.required],
                })
                const formGroupTwo = this.formBuilder.group({
                    turnId: this.data.turnId,
                    paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id,
                    charge: [null, Validators.required],
                })
                this.formArray.push(formGroupOne)
                this.formArray.push(formGroupTwo)
            }
        })
    }

    onAddPayment() {
        const formGroupPayment = this.formBuilder.group({
            turnId: this.data.turnId,
            paymentMethodId: (this.paymentMethods[0] || { _id: '' })._id,
            charge: [null, Validators.required],
        })
        this.formArray.push(formGroupPayment)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const payments = this.formArray.value
            const payed = payments.map((e: PaymentModel) => e.charge).reduce((a: number, b: number) => a + b, 0)
            if (Number(payed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) === Number(this.data.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))) {
                this.dialogRef.close(payments)
            } else {
                this.navigationService.showMessage('Los montos no coinciden')
            }
        }
    }

    onCancel() {
        this.dialogRef.close([])
    }

}
