import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CustomerModel } from './customer.model';
import { SummaryCustomerSaleModel } from './summary-customer-sale.model';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCustomersAdvance(): Observable<any> {
        return this.httpService.get('customers/advance')
    }

    getCustomersByIds(customerIds: string[]): Observable<CustomerModel[]> {
        return this.httpService.post('customers/byCustomerIds', { customerIds })
    }

    joinCustomers(customerIds: string[]) {
        return this.httpService.post('customers/joinCustomers', { customerIds })
    }

    updateLocation(latitude: number, longitude: number, customerId: string) {
        return this.httpService.put(`customers/${latitude}/${longitude}/${customerId}`, {})
    }

    getCustomersByLocationWithSales(locationCode: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byLocationWithSales/${locationCode}`)
    }

    getCustomersByKey(key: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byKey/${key}`)
    }

    getCustomersByMobileNumber(mobileNumber: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byMobileNumber/${mobileNumber}`)
    }

    getCustomersByRuc(key: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byRuc/${key}`)
    }

    getCustomersByDni(key: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byDni/${key}`)
    }

    getCustomersByCe(key: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byCe/${key}`)
    }

    getCustomersByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byPage/${pageIndex}/${pageSize}`, params)
    }

    getCustomersByPageWithLastSale(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byPageWithLastSale/${pageIndex}/${pageSize}`, params)
    }

    getDeletedCustomersByPage(
        pageIndex: number,
        pageSize: number
    ): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/deletedByPage/${pageIndex}/${pageSize}`)
    }

    getDeletedCustomersCount(): Observable<number> {
        return this.httpService.get('customers/countDeletedCustomers')
    }

    getCustomersCount(params: Params): Observable<number> {
        return this.httpService.get('customers/countCustomers', params)
    }

    getCustomerById(customerId: string): Observable<CustomerModel> {
        return this.httpService.get(`customers/byId/${customerId}`)
    }

    getSummarySalesByRangeDateCustomers(
        startDate: Date,
        endDate: Date,
        params: Params
    ): Observable<SummaryCustomerSaleModel[]> {
        return this.httpService.get(`customers/summarySalesByRangeDateCustomers/${startDate}/${endDate}`, params)
    }

    create(customer: any): Observable<CustomerModel> {
        return this.httpService.post('customers', { customer })
    }

    update(customer: any, customerId: string): Observable<CustomerModel> {
        return this.httpService.put(`customers/${customerId}`, { customer })
    }

    delete(customerId: string): Observable<void> {
        return this.httpService.delete(`customers/${customerId}`)
    }

    restore(customerId: string): Observable<void> {
        return this.httpService.delete(`customers/restore/${customerId}`)
    }

}
