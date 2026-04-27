import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ProductModel } from '../product.model'
import { ProductsService } from '../products.service'
import { FavoritesService } from '../../favorites/favorites.service'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'
import { AuthService } from '../../auth/auth.service'
import { Subscription } from 'rxjs'
import { SettingModel } from '../../settings/setting.model'
import { PriceListModel } from '../price-list.model'

@Component({
    selector: 'app-dialog-detail-products',
    imports: [MaterialModule],
    templateUrl: './dialog-detail-products.component.html',
    styleUrls: ['./dialog-detail-products.component.sass']
})
export class DialogDetailProductsComponent {

    readonly product: ProductModel = inject(MAT_DIALOG_DATA)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)

    $stock = signal<number>(0)
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
        this.isFavorite = this.favoritesService.isFavorite(this.product.id)
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
        })

        this.productsService.getStock(this.product.id).subscribe(product => {
            this.$stock.set(product)
        })
    }

    onCreateFavorites() {
        this.favoritesService.create(this.product.id).subscribe(() => {
            this.navigationService.showMessage('Se han guardado los cambios')
            this.favoritesService.loadFavorites()
        })
    }

    onDeleteFavorites() {
        this.favoritesService.delete(this.product.id).subscribe(() => {
            this.navigationService.showMessage('Se han guardado los cambios')
            this.favoritesService.loadFavorites()
        })
    }

}
