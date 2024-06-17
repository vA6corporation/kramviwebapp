import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CreatePaymentPurchaseModel } from './create-payment-purchase.model';
import { PaymentPurchaseModel } from './payment-purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentPurchasesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getCountPaymentPurchases(params: Params): Observable<number> {
    return this.httpService.get('paymentPurchases/countPaymentPurchases', params);
  }

  getPaymentPurchasesByPage(pageIndex: number, pageSize: number, params: Params): Observable<PaymentPurchaseModel[]> {
    return this.httpService.get(`paymentPurchases/${pageIndex}/${pageSize}`, params);
  }

  create(paymentPurchase: CreatePaymentPurchaseModel, purchaseId: string) {
    return this.httpService.post(`paymentPurchases/${purchaseId}`, { paymentPurchase });
  }

  delete(paymentPurchaseId: string, purchaseId: string) {
    return this.httpService.delete(`paymentPurchases/${paymentPurchaseId}/${purchaseId}`);
  }

}
