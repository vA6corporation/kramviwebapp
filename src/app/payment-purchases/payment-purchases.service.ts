import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { PaymentPurchaseModel } from './payment-purchase.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentPurchasesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCountPaymentPurchases(params: Params): Observable<number> {
        return this.httpService.get('paymentPurchases/countPaymentPurchases', params)
    }

    getPaymentPurchasesByPage(pageIndex: number, pageSize: number, params: Params): Observable<PaymentPurchaseModel[]> {
        return this.httpService.get(`paymentPurchases/${pageIndex}/${pageSize}`, params)
    }

    create(paymentPurchase: any, purchaseId: string): Observable<PaymentPurchaseModel> {
        return this.httpService.post(`paymentPurchases/${purchaseId}`, { paymentPurchase })
    }

    update(paymentPurchase: any, purchasePurchaseId:string, purchaseId: string): Observable<void> {
        return this.httpService.put(`paymentPurchases/${purchasePurchaseId}/${purchaseId}`, { paymentPurchase })
    }

    delete(paymentPurchaseId: string, purchaseId: string): Observable<void> {
        return this.httpService.delete(`paymentPurchases/${paymentPurchaseId}/${purchaseId}`)
    }

}
