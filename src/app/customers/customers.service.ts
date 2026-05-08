import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { CustomerModel } from './customer.model'

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

    updateLocation(latitude: number, longitude: number, customerId: any) {
        return this.httpService.put(`customers/${latitude}/${longitude}/${customerId}`, {})
    }

    getCustomersByLocationWithSales(locationCode: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byLocationWithSales/${locationCode}`)
    }

    getCustomersByKey(key: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byKey/${key}`)
    }

    getCustomersByMobileNumber(phone: string): Observable<CustomerModel[]> {
        return this.httpService.get(`customers/byPhone/${phone}`)
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

    getCountCustomers(params: Params): Observable<number> {
        return this.httpService.get('customers/countCustomers', params)
    }

    getCustomerById(customerId: any): Observable<CustomerModel> {
        return this.httpService.get(`customers/byId/${customerId}`)
    }

    create(customer: any): Observable<CustomerModel> {
        return this.httpService.post('customers', { customer })
    }

    update(customer: any, customerId: any): Observable<CustomerModel> {
        return this.httpService.put(`customers/${customerId}`, { customer })
    }

    delete(customerId: any): Observable<void> {
        return this.httpService.delete(`customers/${customerId}`)
    }

    restore(customerId: any): Observable<void> {
        return this.httpService.delete(`customers/restore/${customerId}`)
    }

}
