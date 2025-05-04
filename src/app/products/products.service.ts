import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { OfficeModel } from '../auth/office.model';
import { SettingModel } from '../auth/setting.model';
import { HttpService } from '../http.service';
import { PriceListModel } from './price-list.model';
import { PriceType } from './price-type.enum';
import { PriceModel } from './price.model';
import { ProductModel } from './product.model';

export interface UnitCodeModel {
    code: string
    name: string
}

export interface IgvCodeModel {
    code: string
    name: string
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private igvCodes: IgvCodeModel[] = [
        { code: '10', name: 'GRAVADO' },
        { code: '20', name: 'EXONERADO' },
        { code: '30', name: 'INAFECTO' },
        { code: '11', name: 'BONIFICACION' },
    ]

    private unitCodes: UnitCodeModel[] = [
        { code: 'NIU', name: 'UNIDADES (Productos)' },
        { code: 'ZZ', name: 'UNIDADES (Servicios)' },
        { code: 'BG', name: 'BOLSA' },
        { code: 'BO', name: 'BOTELLA' },
        { code: 'BX', name: 'CAJA' },
        { code: 'PK', name: 'PAQUETE' },
        { code: 'KT', name: 'KIT' },
        { code: 'SET', name: 'JUEGO' },
        { code: 'MTR', name: 'METROS' },
        { code: 'MTQ', name: 'METROS CUBICOS' },
        { code: 'MTK', name: 'METRO CUADRADO' },
        { code: 'MMT', name: 'MILIMETROS' },
        { code: 'KGM', name: 'KILOGRAMOS' },
        { code: 'GRM', name: 'GRAMOS' },
        { code: 'MGM', name: 'MILIGRAMOS' },
        { code: 'LTR', name: 'LITROS' },
        { code: 'MLT', name: 'MILILITROS' },
        { code: 'GLL', name: 'GALONES' },
        { code: 'DZN', name: 'DOCENA' },
        { code: 'CEN', name: 'CIENTO' },
        { code: 'MIL', name: 'MILLARES' },
        { code: 'TNE', name: 'TONELADAS' },
    ]

    private priceLists$: BehaviorSubject<PriceListModel[]> | null = null
    private linkProducts: Map<string, ProductModel[]> = new Map()

    setCacheLinkProducts(productId: string, products: ProductModel[]) {
        this.linkProducts.set(productId, products)
    }

    getCacheLinkProducts(productId: string): ProductModel[] | undefined {
        return this.linkProducts.get(productId)
    }

    static setPrices(
        products: ProductModel[],
        priceListId: string | null,
        setting: SettingModel,
        office: OfficeModel,
    ) {
        switch (setting.defaultPrice) {
            case PriceType.GLOBAL:
                break
            case PriceType.OFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.officeId === office._id && e.priceListId == null)
                    product.price = price ? price.price : product.price
                }
                break
            case PriceType.LISTA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === priceListId)
                    product.price = price ? price.price : product.price
                }
                break
            case PriceType.LISTAOFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === priceListId && e.officeId === office._id)
                    product.price = price ? price.price : product.price
                }
                break
        }
    }

    uploadImage(formData: FormData, productId: string): Observable<{ urlImage: string }> {
        return this.httpService.postFile(`products/uploadFile/${productId}`, formData)
    }

    getUnitCodes(): UnitCodeModel[] {
        return this.unitCodes
    }

    getIgvCodes(): IgvCodeModel[] {
        return this.igvCodes
    }

    getProductsByKey(key: string): Observable<ProductModel[]> {
        const params: Params = { key }
        return this.httpService.get(`products/byKey`, params)
    }

    getProductsByKeyPage(pageIndex: number, pageSize: number, params: Params): Observable<ProductModel[]> {
        return this.httpService.get(`products/byKeyPage/${pageIndex}/${pageSize}`, params)
    }

    countProductsByKey(key: string): Observable<number> {
        const params: Params = { key }
        return this.httpService.get(`products/countProductsByKey`, params)
    }

    getProductStock(productId: string): Observable<number> {
        return this.httpService.get(`products/stock/${productId}`)
    }

    getProductsByPageWithRecipes(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<ProductModel[]> {
        return this.httpService.get(`products/byPageWithRecipes/${pageIndex}/${pageSize}`, params)
    }

    getLinkProducts(productId: string): Observable<ProductModel[]> {
        return this.httpService.get(`products/linkProductsByProduct/${productId}`)
    }

    loadPriceLists(): void {
        console.log('Cargando lista de precios!')
        this.httpService.get('priceLists').subscribe(priceLists => {
            if (this.priceLists$) {
                this.priceLists$.next(priceLists)
            }
        })
    }

    handlePriceLists(): Observable<PriceListModel[]> {
        if (this.priceLists$ === null) {
            this.priceLists$ = new BehaviorSubject<PriceListModel[]>([])
            this.loadPriceLists()
        }
        return this.priceLists$.asObservable()
    }

    getProductsByCategoryPage(categoryId: string, pageIndex: number, pageSize: number): Observable<ProductModel[]> {
        return this.httpService.get(`products/byCategoryPage/${categoryId}/${pageIndex}/${pageSize}`)
    }

    getProductsByPage(pageIndex: number, pageSize: number, params: Params): Observable<ProductModel[]> {
        return this.httpService.get(`products/byPage/${pageIndex}/${pageSize}`, params)
    }

    getCountProductsByCategory(categoryId: string): Observable<number> {
        return this.httpService.get(`products/countProductsByCategory/${categoryId}`)
    }

    getCountProducts(params: Params): Observable<number> {
        return this.httpService.get(`products/countProducts`, params)
    }

    getCountProductsByKey(params: Params): Observable<number> {
        return this.httpService.get(`products/countProductsByKey`, params)
    }

    getProductById(productId: string): Observable<ProductModel> {
        return this.httpService.get(`products/byId/${productId}`)
    }

    getDisabledProducts(pageIndex: number, pageSize: number): Observable<ProductModel[]> {
        return this.httpService.get(`products/disabledProductsByPage/${pageIndex}/${pageSize}`)
    }

    getCountDisabledProducts(): Observable<number> {
        return this.httpService.get(`products/countDisabledProducts`)
    }

    getDeletedProducts(
        pageIndex: number,
        pageSize: number
    ): Observable<ProductModel[]> {
        return this.httpService.get(`products/deletedProductsByPage/${pageIndex}/${pageSize}`)
    }

    getCountDeletedProducts(): Observable<number> {
        return this.httpService.get(`products/countDeletedProducts`)
    }

    create(
        product: any,
        prices: any,
        lots: any[],
        paymentMethodId: string
    ): Observable<ProductModel> {
        return this.httpService.post('products', { product, prices, lots, paymentMethodId })
    }

    updateWithPrices(product: any, prices: any, productId: string, priceType: string): Observable<ProductModel> {
        return this.httpService.put(`products/${productId}/${priceType}`, { product, prices })
    }

    updatePrices(productId: string, priceType: PriceType, prices: PriceModel[], price: number): Observable<ProductModel> {
        return this.httpService.put(`products/updatePrices/${productId}/${priceType}/${price}`, { prices })
    }

    update(product: any, productId: string): Observable<ProductModel> {
        return this.httpService.put(`products/${productId}`, { product })
    }

    updateTrackStock(productId: string): Observable<ProductModel> {
        return this.httpService.put(`products/trackStock/${productId}`, {})
    }

    delete(productId: string): Observable<void> {
        return this.httpService.delete(`products/${productId}`)
    }

    restore(productId: string): Observable<void> {
        return this.httpService.get(`products/restore/${productId}`)
    }

    restoreAll(): Observable<void> {
        return this.httpService.get(`products/restoreAll`)
    }
}
