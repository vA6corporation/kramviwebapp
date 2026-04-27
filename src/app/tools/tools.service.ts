import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { PriceListModel } from '../products/price-list.model'
import { ProductModel } from '../products/product.model'

@Injectable({
    providedIn: 'root'
})
export class ToolsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getDuplicates(invoiceCode: string) {
        return this.httpService.get(`tools/duplicates/${invoiceCode}`)
    }

    exonerateProducts() {
        return this.httpService.get('tools/exonerateProducts')
    }

    updateStock(businessId: any) {
        return this.httpService.get(`tools/updateStock/${businessId}`)
    }

    importCustomers(customers: any[], distributionId: any): Observable<void> {
        return this.httpService.post('tools/importCustomers', { customers, distributionId })
    }

    importProducts(
        products: any[],
        priceLists: PriceListModel[],
        priceType: string,
        paymentMethodId: any
    ): Observable<void> {
        return this.httpService.post(`tools/importProducts/${priceType}/${paymentMethodId}`, { products, priceLists })
    }

    importSupplies(
        supplies: any[],
    ): Observable<void> {
        return this.httpService.post('tools/importSupplies', { supplies })
    }

    importStock(
        products: any[],
    ): Observable<void> {
        return this.httpService.post('tools/importStock', { products })
    }

    checkStock(): Observable<ProductModel[]> {
        return this.httpService.get('tools/checkStock')
    }

    updatePrices(products: any[]): Observable<void> {
        return this.httpService.post('tools/updatePrices', { products })
    }

}
