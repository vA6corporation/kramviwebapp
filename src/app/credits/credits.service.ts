import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CreditModel } from './credit.model';

@Injectable({
    providedIn: 'root'
})
export class CreditsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCreditById(creditId: string): Observable<CreditModel> {
        return this.httpService.get(`credits/byId/${creditId}`);
    }

    getCreditsByCustomer(customerId: string): Observable<CreditModel[]> {
        return this.httpService.get(`credits/byCustomer/${customerId}`);
    }

    getCountCreditsByTurn(turnId: string): Observable<number> {
        return this.httpService.get(`credits/countByTurn/${turnId}`);
    }

    getCreditsByPageTurn(pageIndex: number, pageSize: number, turnId: string): Observable<CreditModel[]> {
        return this.httpService.get(`credits/byPageTurn/${pageIndex}/${pageSize}/${turnId}`);
    }

    getCreditsByTurn(turnId: string): Observable<CreditModel[]> {
        return this.httpService.get(`credits/byTurn/${turnId}`);
    }

    getCountCredits(
        params: Params,
    ): Observable<number> {
        return this.httpService.get('credits/countCredits', params);
    }

    getCreditsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<CreditModel[]> {
        return this.httpService.get(`credits/byPage/${pageIndex}/${pageSize}`, params);
    }

    getNotPaidCredits(): Observable<CreditModel[]> {
        return this.httpService.get(`credits/notPaid`);
    }

    getPaidCreditsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<{ credits: CreditModel[], count: number }> {
        return this.httpService.get(`credits/paidCreditsByPage/${pageIndex}/${pageSize}`, params);
    }

    getCredits(): Observable<CreditModel[]> {
        return this.httpService.get('credits');
    }

    getCreditsByKey(key: string, params: Params): Observable<CreditModel[]> {
        return this.httpService.get(`credits/byKey/${key}`, params);
    }

    getPaidCredits(): Observable<CreditModel[]> {
        return this.httpService.get('credits/paidCredits');
    }

    paidCustomerCredits(
        creditIds: string[],
        paymentMethodId: string,
        turnId: string
    ): Observable<void> {
        return this.httpService.post(`credits/paidCustomerCredits/${paymentMethodId}/${turnId}`, { creditIds });
    }
}
