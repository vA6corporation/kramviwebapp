import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CreatePaymentOrderModel } from './create-payment-order.model';
import { PaymentOrderModel } from './payment-order.model';

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

    getCountPaymentOrdersByRangeDate(
        startDate: string,
        endDate: string
    ): Observable<number> {
        return this.httpService.get(`paymentOrders/countPaymentOrdersByRangeDate/${startDate}/${endDate}`)
    }

    getPaymentOrdersByRangeDate(
        startDate: string,
        endDate: string
    ): Observable<PaymentOrderModel[]> {
        return this.httpService.get(`paymentOrders/paymentOrdersByRangeDate/${startDate}/${endDate}`)
    }

    getPaymentOrdersByRangeDatePage(
        startDate: string,
        endDate: string,
        pageIndex: number,
        pageSize: number
    ): Observable<PaymentOrderModel[]> {
        return this.httpService.get(`paymentOrders/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`)
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
