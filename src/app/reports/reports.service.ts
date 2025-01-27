import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { SaleItemModel } from '../sales/sale-item.model';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getInOutByYearOfficeUser(year: number, params: Params): Observable<any> {
        return this.httpService.get(`reports/inOutByYearOfficeUser/${year}`, params);
    }

    getSalesUtilitiesWithRecipes(startDate: string, endDate: string, officeId: string): Observable<SaleItemModel[]> {
        return this.httpService.get(`sales/utilitiesByRangeDateOfficeWithRecipes/${startDate}/${endDate}/${officeId}`);
    }

    getSummariesByRangeDate(
        params: Params
    ): Observable<any> {
        return this.httpService.get('reports/summary', params);
    }

    getSummaryInvoicesByRangeDate(
        params: Params
    ): Observable<any[]> {
        return this.httpService.get('sales/summaryInvoicesByRangeDate', params);
    }

    getSummarySuppliesOut(params: Params): Observable<any[]> {
        return this.httpService.get('supplies/summarySuppliesOut', params);
    }

    getSummarySuppliesIn(params: Params): Observable<any[]> {
        return this.httpService.get('supplies/summarySuppliesIn', params);
    }

    getSummaryInvoices(params: Params): Observable<any[]> {
        return this.httpService.get(`sales/summaryInvoices`, params);
    }
}
