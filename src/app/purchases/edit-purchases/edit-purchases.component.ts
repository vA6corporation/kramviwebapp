import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { CreatePurchaseItemModel } from '../create-purchase-item.model';
import { PurchasesService } from '../purchases.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPurchaseItemsComponent } from '../dialog-purchase-items/dialog-purchase-items.component';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PurchaseItemsComponent } from '../purchase-items/purchase-items.component';

@Component({
    selector: 'app-edit-purchases',
    imports: [MaterialModule, RouterModule, CommonModule, PurchaseItemsComponent],
    templateUrl: './edit-purchases.component.html',
    styleUrls: ['./edit-purchases.component.sass']
})
export class EditPurchasesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly purchasesService: PurchasesService,
        private readonly categoriesService: CategoriesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
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
    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        const purchaseId = this.activatedRoute.snapshot.params['purchaseId']
        this.navigationService.loadBarStart()
        this.purchasesService.getPurchaseById(purchaseId).subscribe(purchase => {
            this.navigationService.loadBarFinish()
            this.navigationService.setTitle(`Editar compra ${purchase.serie || ''}`)
            this.purchasesService.setPurchase(purchase)
            const purchaseItems: CreatePurchaseItemModel[] = []
            for (const purchaseItem of purchase.purchaseItems) {
                const createdPurchaseItem = {
                    fullName: purchaseItem.fullName,
                    cost: purchaseItem.cost,
                    price: purchaseItem.price,
                    prices: purchaseItem.prices,
                    quantity: purchaseItem.quantity,
                    preIgvCode: purchaseItem.preIgvCode,
                    igvCode: purchaseItem.igvCode,
                    unitCode: purchaseItem.unitCode,
                    isTrackStock: false,
                    productId: purchaseItem.productId,
                    lot: purchaseItem.lot
                }
                purchaseItems.push(createdPurchaseItem)
            }
            this.purchasesService.setPurchaseItems(purchaseItems)
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
