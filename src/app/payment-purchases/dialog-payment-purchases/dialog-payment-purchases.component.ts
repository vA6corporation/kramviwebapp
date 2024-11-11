import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodModel } from '../../payment-methods/payment-method.model';
import { PaymentMethodsService } from '../../payment-methods/payment-methods.service';
import { CreatePaymentPurchaseModel } from '../create-payment-purchase.model';
import { PaymentPurchasesService } from '../payment-purchases.service';

@Component({
    selector: 'app-dialog-payment-purchases',
    templateUrl: './dialog-payment-purchases.component.html',
    styleUrls: ['./dialog-payment-purchases.component.sass']
})
export class DialogPaymentPurchasesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly purchaseId: string,
        private readonly formBuilder: FormBuilder,
        private readonly paymentPurchasesService: PaymentPurchasesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogPaymentPurchasesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        paymentMethodId: '',
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
            this.isLoading = true
            const { paymentMethodId, charge } = this.formGroup.value
            const createPaymentPurchase: CreatePaymentPurchaseModel = {
                paymentMethodId,
                charge,
                purchaseId: this.purchaseId,
            }
            this.paymentPurchasesService.create(createPaymentPurchase, this.purchaseId).subscribe({
                next: () => {
                    this.dialogRef.close(true)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
