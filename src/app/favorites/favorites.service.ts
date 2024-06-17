import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { FavoriteModel } from './favorite.model';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private products: ProductModel[] = []
    private favorites$: BehaviorSubject<ProductModel[]> | null = null

    create(productId: string): Observable<void> {
        return this.httpService.post(`favorites/${productId}`, {})
    }

    createAll(favorites: any[]): Observable<void> {
        return this.httpService.put('favorites', { favorites })
    }

    delete(productId: string): Observable<void> {
        return this.httpService.delete(`favorites/${productId}`)
    }

    isFavorite(productId: string): boolean {
        if (this.products) {
            return this.products.find(e => e._id === productId) ? true : false
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
