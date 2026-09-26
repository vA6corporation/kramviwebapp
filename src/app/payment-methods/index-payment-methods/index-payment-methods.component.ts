import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { PaymentMethodsComponent } from '../payment-methods/payment-methods.component';
import { DisabledPaymentMethodsComponent } from '../disabled-payment-methods/disabled-payment-methods.component';

@Component({
    selector: 'app-index-payment-methods',
    imports: [MaterialModule, PaymentMethodsComponent, DisabledPaymentMethodsComponent],
    templateUrl: './index-payment-methods.component.html',
    styleUrls: ['./index-payment-methods.component.sass'],
})
export class IndexPaymentMethodsComponent {

    constructor() { }

}
