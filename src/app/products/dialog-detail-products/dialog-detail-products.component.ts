import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { SettingModel } from '../../auth/setting.model';
import { PriceListModel } from '../price-list.model';

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
        private readonly authService: AuthService,
    ) { }

    isFavorite: boolean = false
    setting: SettingModel = new SettingModel()
    priceLists: PriceListModel[] = []
    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.isFavorite = this.favoritesService.isFavorite(this.product._id)
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
        })
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
