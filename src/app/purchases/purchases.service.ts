import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreatePurchaseItemModel } from './create-purchase-item.model';
import { CreatePurchaseModel } from './create-purchase.model';
import { PurchaseItemModel } from './purchase-item.model';
import { PurchaseModel } from './purchase.model';
import { UpdatePurchaseModel } from './update-purchase.model';

@Injectable({
    providedIn: 'root'
})
export class PurchasesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private purchaseItems: CreatePurchaseItemModel[] = []
    private purchase: PurchaseModel | null = null

    private purchaseItems$ = new BehaviorSubject<CreatePurchaseItemModel[]>([])

    getPurchasesByYearOfficeUser(year: number, params: Params): Observable<number[]> {
        return this.httpService.get(`purchases/summaryByYearOfficeUser/${year}`, params)
    }

    getCreditPurchasesByProvider(providerId: string): Observable<PurchaseModel[]> {
        return this.httpService.get(`purchases/creditPurchasesByProvider/${providerId}`)
    }

    getPurchaseById(purchaseId: string): Observable<PurchaseModel> {
        return this.httpService.get(`purchases/byId/${purchaseId}`)
    }

    getPurchasesByPage(pageIndex: number, pageSize: number, params: Params): Observable<PurchaseModel[]> {
        return this.httpService.get(`purchases/byPage/${pageIndex}/${pageSize}`, params)
    }

    getPurchasesByRangeDate(
        params: Params
    ): Observable<PurchaseModel[]> {
        return this.httpService.get(`purchases/byRangeDate`, params)
    }

    countCreditPurchases(): Observable<number> {
        return this.httpService.get(`purchases/countCreditPurchases`)
    }

    getCountPurchases(params: Params): Observable<number> {
        return this.httpService.get(`purchases/countPurchases`, params)
    }

    countPurchases(): Observable<number> {
        return this.httpService.get(`purchases/countPurchases`)
    }

    getPurchasesCreditByPage(pageIndex: number, pageSize: number): Observable<PurchaseModel[]> {
        return this.httpService.get(`purchases/creditByPage/${pageIndex}/${pageSize}`)
    }

    getCountQuantityPurchaseItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`purchases/countQuantityPurchaseItemsByProduct/${productId}`)
    }

    getPurchaseItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<PurchaseItemModel[]> {
        return this.httpService.get(`purchases/purchaseItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    setPurchaseItems(purchaseItems: CreatePurchaseItemModel[]) {
        this.purchaseItems = purchaseItems
        this.purchaseItems$.next(this.purchaseItems)
    }

    setPurchase(purchase: PurchaseModel) {
        this.purchase = purchase
    }

    getPurchase(): PurchaseModel | null {
        return this.purchase
    }

    handlePurchaseItems(): Observable<CreatePurchaseItemModel[]> {
        return this.purchaseItems$.asObservable()
    }

    updatePurchaseItem(index: number, purchaseItem: CreatePurchaseItemModel) {
        this.purchaseItems.splice(index, 1, purchaseItem)
        this.purchaseItems$.next(this.purchaseItems)
    }

    removePurchaseItem(index: number) {
        this.purchaseItems.splice(index, 1)
        this.purchaseItems$.next(this.purchaseItems)
    }

    getPurchaseItem(index: number): CreatePurchaseItemModel {
        return this.purchaseItems[index]
    }

    forceAddPurchaseItem(
        product: ProductModel,
    ): number {
        const purchaseItem: CreatePurchaseItemModel = {
            fullName: product.fullName,
            productId: product._id,
            cost: product.cost,
            price: product.price,
            prices: product.prices,
            quantity: 1,
            igvCode: product.igvCode,
            preIgvCode: product.igvCode,
            isTrackStock: product.isTrackStock,
            unitCode: product.unitCode,
            lot: null
        }
        const index = this.purchaseItems.push(purchaseItem)
        this.purchaseItems$.next(this.purchaseItems)
        return index - 1
    }

    addPurchaseItem(product: ProductModel) {
        const index = this.purchaseItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode)
        if (index < 0) {
            const purchaseItem: CreatePurchaseItemModel = {
                fullName: product.fullName,
                productId: product._id,
                cost: product.cost,
                price: product.price,
                prices: product.prices,
                quantity: 1,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                isTrackStock: product.isTrackStock,
                unitCode: product.unitCode,
                lot: null
            }
            this.purchaseItems.push(purchaseItem)
        } else {
            const purchaseItem: CreatePurchaseItemModel = this.purchaseItems[index]
            purchaseItem.quantity += 1
            this.purchaseItems.splice(index, 1, purchaseItem)
        }
        this.purchaseItems$.next(this.purchaseItems)
    }

    create(
        purchase: CreatePurchaseModel,
        purchaseItems: CreatePurchaseItemModel[],
        purchaseOrderId: string | null
    ): Observable<PurchaseModel> {
        return this.httpService.post('purchases', { purchase, purchaseItems, purchaseOrderId })
    }

    createCredit(
        purchase: CreatePurchaseModel,
        purchaseItems: CreatePurchaseItemModel[],
        purchaseOrderId: string | null
    ): Observable<PurchaseModel> {
        return this.httpService.post('purchases/credit', { purchase, purchaseItems, purchaseOrderId })
    }

    updatePurchase(
        purchase: UpdatePurchaseModel,
        purchaseItems: CreatePurchaseItemModel[],
        purchaseId: string,
    ): Observable<PurchaseModel> {
        return this.httpService.put(`purchases/${purchaseId}`, { purchase, purchaseItems })
    }

    deletePurchase(purchaseId: string): Observable<void> {
        return this.httpService.delete(`purchases/${purchaseId}`)
    }

    deletePurchaseItem(purchaseId: string, purchaseItemId: string): Observable<void> {
        return this.httpService.delete(`purchases/deletePurchaseItem/${purchaseId}/${purchaseItemId}`)
    }
}
