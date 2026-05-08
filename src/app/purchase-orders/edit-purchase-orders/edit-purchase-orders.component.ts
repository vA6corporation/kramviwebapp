import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../favorites/favorites.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogPurchaseOrderItemsComponent } from '../dialog-purchase-order-items/dialog-purchase-order-items.component';
import { PurchaseOrderItemsComponent } from '../purchase-order-items/purchase-order-items.component';
import { PurchaseOrdersService } from '../purchase-orders.service';

@Component({
    selector: 'app-edit-purchase-orders',
    imports: [MaterialModule, PurchaseOrderItemsComponent, RouterModule],
    templateUrl: './edit-purchase-orders.component.html',
    styleUrls: ['./edit-purchase-orders.component.sass']
})
export class EditPurchaseOrdersComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly purchaseOrdersService = inject(PurchaseOrdersService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)

    $categories = signal<CategoryModel[]>([])
    $products = signal<ProductModel[]>([])
    $favorites = signal<ProductModel[]>([])
    selectedIndex: number = 0
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

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.$products.set(products)
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
            this.$favorites.set(products)
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
        this.$products.set([])
        if (category.products) {
            this.$products.set(category.products)
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category.id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                this.$products.set(products)
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
