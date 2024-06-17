import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogPurchaseOrderItemsComponent } from '../dialog-purchase-order-items/dialog-purchase-order-items.component';
import { PurchaseOrdersService } from '../purchase-orders.service';

@Component({
    selector: 'app-create-purchase-orders',
    templateUrl: './create-purchase-orders.component.html',
    styleUrls: ['./create-purchase-orders.component.sass']
})
export class CreatePurchaseOrdersComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    selectedIndex: number = 0
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

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
        this.navigationService.setTitle('Nueva orden de compra')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
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

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            this.products = category.products
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                this.products = products
                category.products = products
            })
        }
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.purchaseOrdersService.setPurchaseOrderItems([])
        }
    }

    onSelectProduct(product: ProductModel, event?: MouseEvent): void {
        if (event && event.ctrlKey) {
            const index = this.purchaseOrdersService.forceAddPurchaseItem(product)
            this.matDialog.open(DialogPurchaseOrderItemsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: index,
            })
        } else {
            this.purchaseOrdersService.addPurchaseOrderItem(product)
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

}
