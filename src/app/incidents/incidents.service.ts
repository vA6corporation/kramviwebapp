import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { ProductModel } from '../products/product.model'
import { CreateIncidentItemModel } from './create-incident-item.model'
import { CreateIncidentModel } from './create-incident.model'
import { IncidentItemModel } from './incident-item.model'
import { IncidentModel } from './incident.model'

@Injectable({
    providedIn: 'root'
})
export class IncidentsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private incidentItems: CreateIncidentItemModel[] = []
    private incidentItems$ = new BehaviorSubject<CreateIncidentItemModel[]>([])

    getCountOutIncidentItems(
        params: Params
    ): Observable<number> {
        return this.httpService.get('outIncidents/countOutIncidentItems', params)
    }

    getCountInIncidentItems(
        params: Params
    ): Observable<number> {
        return this.httpService.get('inIncidents/countInIncidentItems', params)
    }

    getCountQuantityOutIncidentItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`outIncidents/countQuantityOutIncidentItemsByProduct/${productId}`)
    }

    getCountQuantityIncidentItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`inIncidents/countQuantityInIncidentItemsByProduct/${productId}`)
    }

    getOutIncidentItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`outIncidents/outIncidentItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    getInIncidentItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`inIncidents/inIncidentItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    getInIncidentItemsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`inIncidents/inIncidentItemsByPage/${pageIndex}/${pageSize}`, params)
    }

    getOutIncidentItemsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<IncidentItemModel[]> {
        return this.httpService.get(`outIncidents/outIncidentItemsByPage/${pageIndex}/${pageSize}`, params)
    }

    getInIncidentById(inIncidentId: string): Observable<IncidentModel> {
        return this.httpService.get(`inIncidents/byId/${inIncidentId}`)
    }

    getOutIncidentById(outIncidentId: string): Observable<IncidentModel> {
        return this.httpService.get(`outIncidents/byId/${outIncidentId}`)
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
        const index = this.incidentItems.findIndex(e => e.productId === product.id && e.igvCode === product.igvCode)
        if (index < 0) {
            const incidentItem: CreateIncidentItemModel = {
                fullName: product.fullName,
                price: product.price,
                cost: product.cost,
                quantity: 1,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                productId: product.id,
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
        inIncident: CreateIncidentModel,
        inIncidentItems: CreateIncidentItemModel[]
    ) {
        return this.httpService.post('inIncidents', { inIncident, inIncidentItems })
    }

    createOut(
        outIncident: CreateIncidentModel,
        outIncidentItems: CreateIncidentItemModel[]
    ) {
        return this.httpService.post('outIncidents', { outIncident, outIncidentItems })
    }

    deleteInIncident(inIncidentId: any) {
        return this.httpService.delete(`inIncidents/${inIncidentId}`)
    }

    deleteOutIncident(outIncidentId: any) {
        return this.httpService.delete(`outIncidents/${outIncidentId}`)
    }

    deleteOutIncidentItem(outIncidentId: any, outIncidentItemId: any) {
        return this.httpService.delete(`outIncidents/deleteOutIncidentItem/${outIncidentId}/${outIncidentItemId}`)
    }

    deleteInIncidentItem(inIncidentId: any, inIncidentItemId: any) {
        return this.httpService.delete(`inIncidents/deleteInIncidentItem/${inIncidentId}/${inIncidentItemId}`)
    }

}
