import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { IncidentsService } from '../incidents.service';
import { MaterialModule } from '../../material.module';
import { IncidentItemsComponent } from '../incident-items/incident-items.component';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../products/categories.service';

@Component({
    selector: 'app-create-incidents',
    imports: [MaterialModule, RouterModule, IncidentItemsComponent],
    templateUrl: './create-incidents.component.html',
    styleUrls: ['./create-incidents.component.sass'],
})
export class CreateIncidentsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly incidentsService: IncidentsService,
        private readonly authService: AuthService,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    selectedIndex: number = 0
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    private sortByName: boolean = true

    private handleSearch$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva incidencia')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.products = products
                    this.selectedIndex = 2
                    const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))
                    if (foundProduct) {
                        this.onSelectProduct(foundProduct)
                    }
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
            this.favorites = products
        })
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.incidentsService.setIncidentItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        this.incidentsService.addIncidentItem(product)
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            const products = category.products
            this.products = products
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                this.products = products
            })
        }
    }

}
