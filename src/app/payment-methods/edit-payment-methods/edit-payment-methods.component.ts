import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../payment-methods.service';

@Component({
    selector: 'app-edit-payment-methods',
    templateUrl: './edit-payment-methods.component.html',
    styleUrls: ['./edit-payment-methods.component.sass']
})
export class EditPaymentMethodsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
    });
    isLoading: boolean = false;
    private paymentMethodId: string = '';

    ngOnInit(): void {
        this.navigationService.setTitle('Editar medio de pago')
        this.paymentMethodId = this.activatedRoute.snapshot.params['paymentMethodId']
        this.paymentMethodsService.getPaymentMethodById(this.paymentMethodId).subscribe(paymentMethod => {
            this.formGroup.patchValue(paymentMethod)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.paymentMethodsService.update(this.formGroup.value, this.paymentMethodId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.paymentMethodsService.loadPaymentMethods()
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
