import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { PriceListModel } from '../products/price-list.model';
import { ProductModel } from '../products/product.model';

@Injectable({
    providedIn: 'root'
})
export class ToolsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    exonerateProducts() {
        return this.httpService.get('tools/exonerateProducts')
    }

    updateStock(businessId: string) {
        return this.httpService.get(`tools/updateStock/${businessId}`)
    }

    importCustomers(customers: any[], distributionId: string): Observable<void> {
        return this.httpService.post('tools/importCustomers', { customers, distributionId });
    }

    importProducts(
        products: any[],
        priceLists: PriceListModel[],
        priceType: string,
        paymentMethodId: string
    ): Observable<void> {
        return this.httpService.post(`tools/importProducts/${priceType}/${paymentMethodId}`, { products, priceLists });
    }

    addStock(
        products: any[],
        paymentMethodId: string,
    ): Observable<void> {
        return this.httpService.post(`tools/addStock/${paymentMethodId}`, { products });
    }

    checkStock(): Observable<ProductModel[]> {
        return this.httpService.get('tools/checkStock')
    }

    updatePrices(products: any[]): Observable<void> {
        return this.httpService.post('tools/updatePrices', { products });
    }
}
