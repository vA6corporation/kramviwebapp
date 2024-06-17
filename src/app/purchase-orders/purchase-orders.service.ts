import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { PurchaseOrderItemModel } from './purchase-order-item.model';
import { PurchaseOrderModel } from './purchase-order.model';

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrdersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private purchaseOrderItems: PurchaseOrderItemModel[] = []
    private purchaseOrder: PurchaseOrderModel | null = null

    private purchaseOrderItems$ = new BehaviorSubject<PurchaseOrderItemModel[]>([])

    setPurchaseOrder(purchaseOrder: PurchaseOrderModel): void {
        this.purchaseOrder = purchaseOrder
    }

    getPurchaseOrder(): PurchaseOrderModel | null {
        return this.purchaseOrder
    }

    setPurchaseOrderItems(purchaseOrderItems: PurchaseOrderItemModel[]) {
        this.purchaseOrderItems = purchaseOrderItems
        this.purchaseOrderItems$.next(this.purchaseOrderItems)
    }

    forceAddPurchaseItem(
        product: ProductModel,
    ): number {
        const purchaseOrderItem: PurchaseOrderItemModel = {
            sku: null,
            fullName: product.fullName,
            productId: product._id,
            name: product.name,
            cost: product.cost,
            price: product.price,
            prices: product.prices,
            quantity: 1,
            unitCode: product.unitCode,
            igvCode: product.igvCode,
            preIgvCode: product.igvCode,
            observations: ''
        }
        const index = this.purchaseOrderItems.push(purchaseOrderItem)
        this.purchaseOrderItems$.next(this.purchaseOrderItems)
        return index - 1
    }

    addPurchaseOrderItem(product: ProductModel) {
        const index = this.purchaseOrderItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode)
        if (index < 0) {
            const purchaseOrderItem: PurchaseOrderItemModel = {
                sku: null,
                fullName: product.fullName,
                productId: product._id,
                name: product.name,
                cost: product.cost,
                price: product.price,
                prices: product.prices,
                quantity: 1,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                observations: ''
            }
            this.purchaseOrderItems.push(purchaseOrderItem)
        } else {
            const purchaseOrderItem: PurchaseOrderItemModel = this.purchaseOrderItems[index]
            purchaseOrderItem.quantity += 1
            this.purchaseOrderItems.splice(index, 1, purchaseOrderItem)
        }
        this.purchaseOrderItems$.next(this.purchaseOrderItems)
    }

    createPurchaseOrder(purchaseOrder: any, purchaseOrderItems: PurchaseOrderItemModel[]): Observable<PurchaseOrderModel> {
        return this.httpService.post('purchaseOrders', { purchaseOrder, purchaseOrderItems })
    }

    updatePurchaseOrderItem(index: number, purchaseOrderItem: PurchaseOrderItemModel) {
        this.purchaseOrderItems.splice(index, 1, purchaseOrderItem)
        this.purchaseOrderItems$.next(this.purchaseOrderItems)
    }

    removePurchaseOrderItem(index: number) {
        this.purchaseOrderItems.splice(index, 1)
        this.purchaseOrderItems$.next(this.purchaseOrderItems)
    }

    updatePurchaseOrder(
        purchaseOrder: any,
        purchaseOrderItems: PurchaseOrderItemModel[],
        purchaseOrderId: string
    ): Observable<void> {
        return this.httpService.put(`purchaseOrders/${purchaseOrderId}`, { purchaseOrder, purchaseOrderItems })
    }

    getPurchaseOrderItems(): Observable<PurchaseOrderItemModel[]> {
        return this.purchaseOrderItems$.asObservable()
    }

    getPurchaseOrderItem(index: number): PurchaseOrderItemModel {
        return this.purchaseOrderItems[index]
    }

    getPurchaseOrderById(purchaseOrderId: string): Observable<PurchaseOrderModel> {
        return this.httpService.get(`purchaseOrders/byId/${purchaseOrderId}`)
    }

    countPurchaseOrders(params: Params): Observable<number> {
        return this.httpService.get('purchaseOrders/countPurchaseOrders', params)
    }

    getPurchaseOrdersByPage(pageIndex: number, pageSize: number, params: Params): Observable<PurchaseOrderModel[]> {
        return this.httpService.get(`purchaseOrders/byPage/${pageIndex}/${pageSize}`, params)
    }

    softDelete(purchaseOrderId: string) {
        return this.httpService.delete(`purchaseOrders/${purchaseOrderId}`)
    }

}
