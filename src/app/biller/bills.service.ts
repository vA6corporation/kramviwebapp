import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { CreateDueModel } from '../dues/create-due.model'
import { HttpService } from '../http.service'
import { PaymentModel } from '../payments/payment.model'
import { CreatePaymentModel } from '../payments/create-payment.model'
import { SaleModel } from '../sales/sale.model'
import { ProductItemModel } from './product-item.model'
import { CreateSaleModel } from '../sales/create-sale.model'
import { CreateCreditModel } from '../sales/create-credit.model'
import { UpdateSaleModel } from '../sales/update-sale.model'

@Injectable({
    providedIn: 'root'
})
export class BillsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private productItems: ProductItemModel[] = []
    private productItems$: Subject<ProductItemModel[]> = new Subject()

    setProductItems(productItems: ProductItemModel[]) {
        this.productItems = productItems
        this.productItems$.next(this.productItems)
    }

    getProductItem(index: number): ProductItemModel {
        return this.productItems[index]
    }

    updateProductItem(productItem: ProductItemModel, index: number,) {
        this.productItems.splice(index, 1, productItem)
        this.productItems$.next(this.productItems)
    }

    removeProductItem(index: number) {
        this.productItems.splice(index, 1)
        this.productItems$.next(this.productItems)
    }

    handleProductItems(): Observable<ProductItemModel[]> {
        return this.productItems$.asObservable()
    }

    addProductItem(productItem: ProductItemModel) {
        this.productItems.push(productItem)
        this.productItems$.next(this.productItems)
    }

    save(
        sale: CreateSaleModel | CreateCreditModel,
        productItems: ProductItemModel[],
        payments: CreatePaymentModel[],
        dues: CreateDueModel[],
        detraction: any
    ): Observable<SaleModel> {
        return this.httpService.post('sales/bill', { sale, productItems, payments, dues, detraction })
    }

    saveCredit(
        credit: CreateCreditModel,
        saleItems: ProductItemModel[],
        payments: PaymentModel[],
        dues: CreateDueModel[],
        detraction: any
    ): Observable<SaleModel> {
        return this.httpService.post('credits/bill', { credit, saleItems, payments, dues, detraction })
    }

    update(
        sale: UpdateSaleModel,
        saleItems: ProductItemModel[],
        payments: CreatePaymentModel[],
        saleId: string
    ): Observable<void> {
        return this.httpService.put(`sales/bill/${saleId}`, { sale, saleItems, payments })
    }
}
