import { Component, inject, signal } from '@angular/core'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { ProductsService } from '../../products/products.service'
import { FavoritesService } from '../../favorites/favorites.service'
import { IncidentsService } from '../incidents.service'
import { CategoryModel } from '../../products/category.model'
import { ProductModel } from '../../products/product.model'
import { Subscription } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { MaterialModule } from '../../material.module'
import { IncidentItemsComponent } from '../incident-items/incident-items.component'
import { RouterModule } from '@angular/router'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { AuthService } from '../../auth/auth.service'

@Component({
    selector: 'app-create-out-incidents',
    imports: [MaterialModule, RouterModule, IncidentItemsComponent],
    templateUrl: './create-out-incidents.component.html',
    styleUrl: './create-out-incidents.component.sass'
})
export class CreateOutIncidentsComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly incidentsService = inject(IncidentsService)
    private readonly authService = inject(AuthService)

    $categories = signal<CategoryModel[]>([])
    $products = signal<ProductModel[]>([])
    $favorites = signal<ProductModel[]>([])
    $setting = signal<SettingModel>(new SettingModel())
    priceListId: string | null = null
    office: OfficeModel = new OfficeModel()
    selectedIndex: number = 0

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
        this.navigationService.setTitle('Nueva reduccion de stock')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.$products.set(products)
                    this.selectedIndex = 2
                    ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                    const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))
                    if (foundProduct) {
                        this.onSelectProduct(foundProduct)
                    }
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
            this.priceListId = this.$setting().defaultPriceListId

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                this.$favorites.set(products)
            })
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
        this.$products.set([])
        if (category.products) {
            const products = category.products
            this.$products.set(products)
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category.id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                this.$products.set(products)
            })
        }
    }

}
