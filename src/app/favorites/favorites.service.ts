import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { ProductModel } from '../products/product.model'
import { FavoriteModel } from './favorite.model'

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private products: ProductModel[] = []
    private favorites$: BehaviorSubject<ProductModel[]> | null = null

    create(productId: any): Observable<void> {
        return this.httpService.post(`favorites/${productId}`, {})
    }

    createAll(favorites: any[]): Observable<void> {
        return this.httpService.put('favorites', { favorites })
    }

    delete(productId: any): Observable<void> {
        return this.httpService.delete(`favorites/${productId}`)
    }

    isFavorite(productId: any): boolean {
        if (this.products) {
            return this.products.find(e => e.id === productId) ? true : false
        } else {
            return false
        }
    }

    handleFavorites(): Observable<ProductModel[]> {
        if (this.favorites$ === null) {
            this.favorites$ = new BehaviorSubject<ProductModel[]>([])
            this.loadFavorites()
        }
        return this.favorites$.asObservable()
    }

    loadFavorites() {
        return this.httpService.get('favorites/withProducts').subscribe(favorites => {
            this.products = favorites.map((e: FavoriteModel) => e.product)
            if (this.favorites$) {
                this.favorites$.next(this.products)
            }
        })
    }
}
