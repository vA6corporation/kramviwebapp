import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CreatePaymentOrderModel } from './create-payment-order.model';
import { PaymentOrderModel } from './payment-order.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PaymentOrdersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getPaymentOrderById(paymentOrderId: string): Observable<PaymentOrderModel> {
        return this.httpService.get(`paymentOrders/byId/${paymentOrderId}`)
    }

    getCountPaymentOrders(params: Params): Observable<number> {
        return this.httpService.get('paymentOrders/countPaymentOrders', params)
    }

    getPaymentOrdersByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<PaymentOrderModel[]> {
        return this.httpService.get(`paymentOrders/byPage/${pageIndex}/${pageSize}`, params)
    }

    getPaymentOrdersByRangeDate(
        startDate: string,
        endDate: string,
        params: Params
    ): Observable<PaymentOrderModel[]> {
        return this.httpService.get(`paymentOrders/byRangeDate/${startDate}/${endDate}`, params)
    }

    getPaymentOrdersByKey(key: string): Observable<PaymentOrderModel[]> {
        const params = { key }
        return this.httpService.get(`paymentOrders/byKey`, params)
    }

    create(paymentOrder: CreatePaymentOrderModel): Observable<PaymentOrderModel> {
        return this.httpService.post('paymentOrders', { paymentOrder })
    }

    update(paymentOrder: PaymentOrderModel, paymentOrderId: string) {
        return this.httpService.put(`paymentOrders/${paymentOrderId}`, { paymentOrder })
    }

    delete(paymentOrderId: string): Observable<void> {
        return this.httpService.delete(`paymentOrders/${paymentOrderId}`)
    }

    uploadFile(formData: FormData, paymentOrderId: string): Observable<{ urlPdf: string }> {
        return this.httpService.postFile(`paymentOrders/uploadFile/${paymentOrderId}`, formData)
    }

    deleteFile(paymentOrderId: string) {
        return this.httpService.delete(`paymentOrders/deleteFile/${paymentOrderId}`)
    }

}
