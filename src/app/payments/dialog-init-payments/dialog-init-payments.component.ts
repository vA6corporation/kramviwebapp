import { Component, inject } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service'
import { MaterialModule } from '../../material.module'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'

@Component({
    selector: 'app-dialog-init-payments',
    imports: [MaterialModule, ReactiveFormsModule,],
    templateUrl: './dialog-init-payments.component.html',
    styleUrls: ['./dialog-init-payments.component.sass']
})
export class DialogInitPaymentsComponent {

    private readonly turnId: any = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly paymentMethodsService = inject(PaymentMethodsService)
    private readonly dialogRef: MatDialogRef<DialogInitPaymentsComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        turnId: this.turnId,
        paymentMethodId: [null, Validators.required],
        createdAt: new Date(),
        charge: [null, Validators.required],
    })
    paymentMethods: PaymentMethodModel[] = []

    private handlePaymentMethods$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePaymentMethods$.unsubscribe()
    }

    ngOnInit(): void {
        this.handlePaymentMethods$ = this.paymentMethodsService.handlePaymentMethods().subscribe(paymentMethods => {
            this.paymentMethods = paymentMethods
            this.formGroup.patchValue({ paymentMethodId: (this.paymentMethods[0] || { id: 0 }).id })
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
