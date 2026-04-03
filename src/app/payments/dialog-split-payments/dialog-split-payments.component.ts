import { Component, inject } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreatePaymentModel } from '../create-payment.model'
import { NavigationService } from '../../navigation/navigation.service'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { PaymentModel } from '../payment.model'
import { MaterialModule } from '../../material.module'

export interface DialogSplitPaymentsData {
    turnId: any
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

    private readonly data: DialogSplitPaymentsData = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly dialogRef: MatDialogRef<DialogSplitPaymentsComponent> = inject(MatDialogRef)

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
                    paymentMethodId: (this.paymentMethods[0] || { id: '' }).id,
                    charge: [null, Validators.required],
                })
                const formGroupTwo = this.formBuilder.group({
                    turnId: this.data.turnId,
                    paymentMethodId: (this.paymentMethods[0] || { id: '' }).id,
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
            paymentMethodId: (this.paymentMethods[0] || { id: '' }).id,
            charge: [null, Validators.required],
        })
        this.formArray.push(formGroupPayment)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const payments = this.formArray.value
            const payed = payments.map((e: PaymentModel) => e.charge).reduce((a: number, b: number) => a + b, 0)
            if (Number(payed.toFixed(2)) === Number(this.data.charge.toFixed(2))) {
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
