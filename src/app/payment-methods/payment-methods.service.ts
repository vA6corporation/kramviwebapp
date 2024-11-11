import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { PaymentMethodModel } from './payment-method.model';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PaymentMethodsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private paymentMethods$: BehaviorSubject<PaymentMethodModel[]> | null = null

    getPaymentMethodById(paymentMethodId: string): Observable<PaymentMethodModel> {
        return this.httpService.get(`paymentMethods/byId/${paymentMethodId}`)
    }

    getDisabledPaymentMethods(): Observable<PaymentMethodModel[]> {
        return this.httpService.get(`paymentMethods/disabled`)
    }

    handlePaymentMethods() {
        if (this.paymentMethods$ === null) {
            this.paymentMethods$ = new BehaviorSubject<PaymentMethodModel[]>([])
            this.loadPaymentMethods()
        }
        return this.paymentMethods$.asObservable().pipe(filter(e => e.length > 0))
    }

    loadPaymentMethods(): void {
        this.httpService.get('paymentMethods').subscribe(paymentMethods => {
            if (this.paymentMethods$) {
                this.paymentMethods$.next(paymentMethods)
            }
        })
    }

    create(paymentMethod: any): Observable<PaymentMethodModel> {
        return this.httpService.post('paymentMethods', { paymentMethod })
    }

    update(paymentMethod: any, paymentMethodId: string): Observable<any> {
        return this.httpService.put(`paymentMethods/${paymentMethodId}`, { paymentMethod })
    }

    delete(paymentMethodId: string): Observable<void> {
        return this.httpService.delete(`paymentMethods/${paymentMethodId}`)
    }

}
