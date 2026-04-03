import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { ProductModel } from '../products/product.model'
import { CreateProformaModel } from './create-proforma.model'
import { ProformaItemModel } from './proforma-item.model'
import { ProformaModel } from './proforma.model'
import { SummaryProformaModel } from './summary-proforma.model'

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
        const index = this.proformaItems.findIndex(e => e.productId === product.id && e.igvCode === product.igvCode)
        if (index < 0) {
            const proformaItem: ProformaItemModel = {
                productId: product.id,
                sku: product.sku,
                upc: product.upc,
                fullName: product.fullName,
                isTrackStock: product.isTrackStock,
                price: product.price,
                quantity: 1,
                preIgvCode: product.igvCode,
                igvCode: product.igvCode,
                unitCode: product.unitCode,
                observation: '',
                unitName: product.unitName,
                description: product.description,
                urlImage: product.urlImage,
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

    getProformaById(proformaId: any): Observable<ProformaModel> {
        return this.httpService.get(`proformas/byId/${proformaId}`)
    }

    getSummaryProformasByRangeDateWorkers(
        startDate: string,
        endDate: string,
        params: Params
    ): Observable<SummaryProformaModel[]> {
        return this.httpService.get(`proformas/summaryProformasByRangeDateWorker/${startDate}/${endDate}`, params)
    }

    getCountProformas(params: Params): Observable<number> {
        return this.httpService.get(`proformas/countProformas`, params)
    }

    getProformasByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<ProformaModel[]> {
        return this.httpService.get(`proformas/byPage/${pageIndex}/${pageSize}`, params)
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
        proformaId: any
    ) {
        return this.httpService.put(`proformas/${proformaId}`, { proforma, proformaItems })
    }
}
