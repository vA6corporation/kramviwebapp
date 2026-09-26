import { Injectable } from '@angular/core'
import { HttpService } from '../http.service'
import { ProductModel } from '../products/product.model'
import { Observable } from 'rxjs'
import { Params } from '@angular/router'

@Injectable({
    providedIn: 'root'
})
export class InventoriesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getProductsByPageWithKardex(pageIndex: number, pageSize: number, params: Params): Observable<ProductModel[]> {
        return this.httpService.get(`inventories/byPageWithKardex/${pageIndex}/${pageSize}`, params)
    }

}
