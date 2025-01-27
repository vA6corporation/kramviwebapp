import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreateIncidentItemModel } from './create-incident-item.model';
import { CreateIncidentModel } from './create-incident.model';
import { IncidentItemModel } from './incident-item.model';
import { IncidentModel } from './incident.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private incidentItems: CreateIncidentItemModel[] = []
    private incidentItems$ = new BehaviorSubject<CreateIncidentItemModel[]>([])

    getCountIncidentOutItems(
        params: Params
    ): Observable<number> {
        return this.httpService.get('incidents/countIncidentOutItems', params)
    }

    getCountIncidentInItems(
        params: Params
    ): Observable<number> {
        return this.httpService.get('incidents/countIncidentInItems', params)
    }

    getCountQuantityIncidentOutItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`incidents/countQuantityIncidentOutItemsByProduct/${productId}`)
    }

    getCountQuantityIncidentInItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`incidents/countQuantityIncidentInItemsByProduct/${productId}`)
    }

    getIncidentOutItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`incidents/incidentOutItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    getIncidentInItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`incidents/incidentInItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    getIncidentInItemsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`incidents/incidentInItemsByPage/${pageIndex}/${pageSize}`, params)
    }

    getIncidentOutItemsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`incidents/incidentOutItemsByPage/${pageIndex}/${pageSize}`, params)
    }

    getIncidentById(incidentId: string): Observable<IncidentModel> {
        return this.httpService.get(`incidents/byId/${incidentId}`)
    }

    handleIncidentItems(): Observable<CreateIncidentItemModel[]> {
        return this.incidentItems$.asObservable()
    }

    getIncidentItem(index: number): CreateIncidentItemModel {
        return this.incidentItems[index]
    }

    setIncidentItems(incidentItems: IncidentItemModel[]) {
        this.incidentItems = incidentItems
        this.incidentItems$.next(this.incidentItems)
    }

    updateIncidentItem(index: number, purchaseItem: CreateIncidentItemModel) {
        this.incidentItems.splice(index, 1, purchaseItem)
        this.incidentItems$.next(this.incidentItems)
    }

    removeIncidentItem(index: number) {
        this.incidentItems.splice(index, 1)
        this.incidentItems$.next(this.incidentItems)
    }

    addIncidentItem(product: ProductModel) {
        const index = this.incidentItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode)
        if (index < 0) {
            const incidentItem: CreateIncidentItemModel = {
                fullName: product.fullName,
                cost: product.cost,
                quantity: 1,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                productId: product._id,
            }
            this.incidentItems.push(incidentItem)
        } else {
            const incidentItem: CreateIncidentItemModel = this.incidentItems[index]
            incidentItem.quantity += 1
            this.incidentItems.splice(index, 1, incidentItem)
        }
        this.incidentItems$.next(this.incidentItems)
    }

    createIn(
        incident: CreateIncidentModel,
        incidentInItems: CreateIncidentItemModel[]
    ) {
        return this.httpService.post('incidents/in', { incident, incidentInItems })
    }

    createOut(
        incident: CreateIncidentModel,
        incidentOutItems: CreateIncidentItemModel[]
    ) {
        return this.httpService.post('incidents/out', { incident, incidentOutItems })
    }

    deleteIncident(incidentId: string) {
        return this.httpService.delete(`incidents/deleteIncident/${incidentId}`)
    }

    deleteIncidentItem(incidentId: string, incidentItemId: string) {
        return this.httpService.delete(`incidents/deleteIncidentItem/${incidentId}/${incidentItemId}`)
    }
}
