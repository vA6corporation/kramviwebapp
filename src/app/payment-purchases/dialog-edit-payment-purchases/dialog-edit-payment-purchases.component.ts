import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PaymentModel } from '../../payments/payment.model'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { PaymentPurchaseModel } from '../payment-purchase.model'

@Component({
    selector: 'app-dialog-edit-payment-purchases',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-payment-purchases.component.html',
    styleUrl: './dialog-edit-payment-purchases.component.sass'
})
export class DialogEditPaymentPurchasesComponent {

    private readonly paymentPurchase: PaymentPurchaseModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly dialogRef: MatDialogRef<DialogEditPaymentPurchasesComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        observation: '',
        charge: [null, Validators.required],
        paymentMethodId: [null, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.formGroup.patchValue(this.paymentPurchase)
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
