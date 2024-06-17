import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreateProformaModel } from './create-proforma.model';
import { ProformaItemModel } from './proforma-item.model';
import { ProformaModel } from './proforma.model';
import { SummaryProformaModel } from './summary-proforma.model';

@Injectable({
    providedIn: 'root'
})
export class ProformasService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private proformaItems$ = new BehaviorSubject<ProformaItemModel[]>([])
    private proforma: ProformaModel | null = null
    private proformaItems: ProformaItemModel[] = []

    setProforma(proforma: ProformaModel) {
        this.proforma = proforma
    }

    getProforma(): ProformaModel | null {
        return this.proforma
    }

    handleProformaItems() {
        return this.proformaItems$.asObservable()
    }

    setProformaItems(proformaItems: ProformaItemModel[]) {
        this.proformaItems = proformaItems
        this.proformaItems$.next(this.proformaItems)
    }

    getProformaItem(index: number): ProformaItemModel {
        return this.proformaItems[index]
    }

    updateProformaItem(index: number, proformaItem: ProformaItemModel) {
        this.proformaItems.splice(index, 1, proformaItem)
        this.proformaItems$.next(this.proformaItems)
    }

    removeProformaItem(index: number) {
        this.proformaItems.splice(index, 1)
        this.proformaItems$.next(this.proformaItems)
    }

    addProformaItem(product: ProductModel) {
        const index = this.proformaItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode)
        if (index < 0) {
            const proformaItem: ProformaItemModel = {
                productId: product._id,
                sku: product.sku,
                upc: product.upc,
                fullName: product.fullName,
                onModel: product.onModel,
                isTrackStock: product.isTrackStock,
                price: product.price,
                quantity: 1,
                preIgvCode: product.igvCode,
                igvCode: product.igvCode,
                unitCode: product.unitCode,
                observations: '',
                unitName: product.unitName,
                description: product.description,
                imageId: product.imageId,
                prices: product.prices,
            }

            this.proformaItems.push(proformaItem)
        } else {
            const proformaItem: ProformaItemModel = this.proformaItems[index]
            proformaItem.quantity += 1
            this.proformaItems.splice(index, 1, proformaItem)
        }
        this.proformaItems$.next(this.proformaItems)
    }

    getProformaById(proformaId: string): Observable<ProformaModel> {
        return this.httpService.get(`proformas/byId/${proformaId}`)
    }

    getSummaryProformasByRangeDateWorkers(
        startDate: string,
        endDate: string,
        params: Params
    ): Observable<SummaryProformaModel[]> {
        return this.httpService.get(`proformas/summaryProformasByRangeDateWorker/${startDate}/${endDate}`, params)
    }

    getCountProformasByKey(key: string): Observable<number> {
        return this.httpService.get(`proformas/countProformasByKey/${key}`)
    }

    getCountProformasByRangeDate(startDate: Date, endDate: Date, params: Params): Observable<number> {
        return this.httpService.get(`proformas/countProformasByRangeDate/${startDate}/${endDate}`, params)
    }

    getProformasByRangeDatePage(
        startDate: Date,
        endDate: Date,
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<ProformaModel[]> {
        return this.httpService.get(`proformas/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    getProformasByPageKey(
        pageIndex: number,
        pageSize: number,
        key: string
    ): Observable<ProformaModel[]> {
        return this.httpService.get(`proformas/byPageKey/${pageIndex}/${pageSize}/${key}`)
    }

    create(
        proforma: CreateProformaModel,
        proformaItems: ProformaItemModel[]
    ): Observable<ProformaModel> {
        return this.httpService.post('proformas', { proforma, proformaItems })
    }

    createWithStock(
        proforma: CreateProformaModel,
        proformaItems: ProformaItemModel[]
    ): Observable<{ proforma: ProformaModel | null, outStocks: any[] }> {
        return this.httpService.post('proformas/withStock', { proforma, proformaItems })
    }

    update(
        proforma: CreateProformaModel,
        proformaItems: ProformaItemModel[],
        proformaId: string
    ) {
        return this.httpService.put(`proformas/${proformaId}`, { proforma, proformaItems })
    }
}
