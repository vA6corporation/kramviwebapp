import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { PaymentMethodsService } from '../payment-methods.service';

@Component({
    selector: 'app-create-payment-methods',
    templateUrl: './create-payment-methods.component.html',
    styleUrls: ['./create-payment-methods.component.sass']
})
export class CreatePaymentMethodsComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
    })

    isLoading: boolean = false

    ngOnInit() {
        this.navigationService.setTitle('Nuevo medio de pago')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.paymentMethodsService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                    this.paymentMethodsService.loadPaymentMethods()
                    this.router.navigate(['/paymentMethods'])
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
