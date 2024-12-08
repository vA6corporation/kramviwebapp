import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { PurchaseOrdersService } from '../purchase-orders.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPurchaseOrderItemsComponent } from '../dialog-purchase-order-items/dialog-purchase-order-items.component';
import { MaterialModule } from '../../material.module';
import { PurchaseOrderItemsComponent } from '../purchase-order-items/purchase-order-items.component';

@Component({
    selector: 'app-edit-purchase-orders',
    imports: [MaterialModule, PurchaseOrderItemsComponent],
    templateUrl: './edit-purchase-orders.component.html',
    styleUrls: ['./edit-purchase-orders.component.sass']
})
export class EditPurchaseOrdersComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly purchaseOrdersService: PurchaseOrdersService,
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
    private purchaseOrderId: string = ''

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
        this.navigationService.setTitle('Editar orden de compra')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
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

        this.purchaseOrderId = this.activatedRoute.snapshot.params['purchaseOrderId']
        this.purchaseOrdersService.getPurchaseOrderById(this.purchaseOrderId).subscribe(purchaseOrder => {
            this.purchaseOrdersService.setPurchaseOrder(purchaseOrder)
            const { purchaseOrderItems } = purchaseOrder
            this.purchaseOrdersService.setPurchaseOrderItems(purchaseOrderItems)
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

}
