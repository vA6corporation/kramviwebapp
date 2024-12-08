import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-detail-products',
    imports: [MaterialModule],
    templateUrl: './dialog-detail-products.component.html',
    styleUrls: ['./dialog-detail-products.component.sass']
})
export class DialogDetailProductsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly product: ProductModel,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly navigationService: NavigationService,
    ) { }

    isFavorite: boolean = false

    ngOnInit(): void {
        this.isFavorite = this.favoritesService.isFavorite(this.product._id)
        this.productsService.getProductById(this.product._id).subscribe(product => {
            Object.assign(this.product, {
                stock: product.stock,
                description: product.description,
                location: product.location,
                isTrackStock: product.isTrackStock,
            })
        })
    }

    onCreateFavorites() {
        this.favoritesService.create(this.product._id).subscribe(() => {
            this.navigationService.showMessage('Favorito agregado correctamente')
            this.favoritesService.loadFavorites()
        })
    }

    onDeleteFavorites() {
        this.favoritesService.delete(this.product._id).subscribe(() => {
            this.navigationService.showMessage('Favorito removido correctamente')
            this.favoritesService.loadFavorites()
        })
    }

}
