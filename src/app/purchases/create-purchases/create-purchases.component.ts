import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { FavoritesService } from '../../favorites/favorites.service'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component'
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component'
import { PurchasesService } from '../purchases.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { AuthService } from '../../auth/auth.service'

@Component({
    selector: 'app-create-purchases',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './create-purchases.component.html',
    styleUrls: ['./create-purchases.component.sass']
})
export class CreatePurchasesComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly purchasesService = inject(PurchasesService)
    private readonly categoriesService = inject(CategoriesService)
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
    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva compra')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.$products.set(products)
                    this.selectedIndex = 2
                    ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                    const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))
                    if (foundProduct) {
                        this.onSelectProduct(foundProduct)
                    }
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
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

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.$products.set([])
        if (category.products) {
            this.$products.set(category.products)
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category.id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                this.$products.set(products)
            })
        }
    }

    onRightClick(product: ProductModel) {
        this.matDialog.open(DialogDetailProductsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: product,
        })
        return false
    }

    urlImage(product: ProductModel) {
        const styleObject: any = {}
        if (product.urlImage) {
            styleObject['background-image'] = `url(${decodeURIComponent(product.urlImage)})`
            styleObject['background-size'] = 'cover'
            styleObject['background-position'] = 'center'
        } else {
            if (product.isTrackStock && product.stock < 1) {
                styleObject['background'] = '#ffa7a6'
            }
        }
        return styleObject
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.purchasesService.setPurchaseItems([])
        }
    }

    onSelectProduct(product: ProductModel, event?: MouseEvent): void {
        if (event && event.ctrlKey) {
            const index = this.purchasesService.forceAddPurchaseItem(product)
            this.matDialog.open(DialogPurchaseItemsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: index,
            })
        } else {
            this.purchasesService.addPurchaseItem(product)
        }
    }

}
