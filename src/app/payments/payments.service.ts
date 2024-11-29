import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CreatePaymentModel } from './create-payment.model';
import { PaymentModel } from './payment.model';
import { SummaryPaymentModel } from './summary-payment.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getPaymentsByPageTurn(
        pageIndex: number,
        pageSize: number,
        turnId: string
    ): Observable<PaymentModel[]> {
        return this.httpService.get(`payments/byPageTurn/${pageIndex}/${pageSize}/${turnId}`)
    }

    getCountPaymentsByTurn(
        turnId: string
    ): Observable<number> {
        return this.httpService.get(`payments/countByTurn/${turnId}`)
    }

    getCountPaymentsByRangeDate(
        startDate: string,
        endDate: string,
        params: Params,
    ): Observable<number> {
        return this.httpService.get(`payments/countByRangeDate/${startDate}/${endDate}`, params)
    }

    getSummaryPaymentsByTurn(turnId: string): Observable<SummaryPaymentModel[]> {
        return this.httpService.get(`payments/summaryByTurn/${turnId}`)
    }

    getSummaryPaymentsByRangeDate(startDate: string, endDate: string, params: Params): Observable<SummaryPaymentModel[]> {
        return this.httpService.get(`payments/summaryByRangeDate/${startDate}/${endDate}`, params)
    }

    getPaymentsByYearOfficeUser(
        year: number,
        params: Params
    ): Observable<number[]> {
        return this.httpService.get(`payments/byYearOfficeUser/${year}`, params)
    }

    getPaymentsInOutByYearOfficeUser(
        year: number,
        params: Params
    ): Observable<{ paymentsIn: number[], paymentsOut: number[] }> {
        return this.httpService.get(`payments/inOutByYearOfficeUser/${year}`, params)
    }

    getPaymentsByRangeDatePage(
        startDate: string,
        endDate: string,
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<PaymentModel[]> {
        return this.httpService.get(`payments/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    getPaymentsByRangeDatePageWithSale(
        startDate: string,
        endDate: string,
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<PaymentModel[]> {
        return this.httpService.get(`payments/byRangeDatePageWithSale/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    create(
        payment: CreatePaymentModel,
        saleId: string
    ): Observable<PaymentModel> {
        return this.httpService.post(`payments/${saleId}`, { payment })
    }

    update(
        payment: PaymentModel,
        paymentId: string,
        saleId: string
    ): Observable<void> {
        return this.httpService.put(`payments/${paymentId}/${saleId}`, { payment })
    }

    delete(
        paymentId: string,
        saleId: string
    ): Observable<void> {
        return this.httpService.delete(`payments/${saleId}/${paymentId}`)
    }

}
