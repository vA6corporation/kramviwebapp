import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuideItemsComponent } from '../remission-guide-items/remission-guide-items.component';
import { RemissionGuidesService } from '../remission-guides.service';

@Component({
    selector: 'app-create-remission-guides',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, RemissionGuideItemsComponent],
    templateUrl: './create-remission-guides.component.html',
    styleUrls: ['./create-remission-guides.component.sass'],
})
export class CreateRemissionGuidesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    selectedIndex: number = 0
    remissionGuideItems: RemissionGuideItemModel[] = []
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleRemissionGuideItems$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleRemissionGuideItems$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                this.favorites = products
            })
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Nueva guia de remision')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleRemissionGuideItems$ = this.remissionGuidesService.handleRemissionGuideItems().subscribe(remissionGuideItems => {
            this.remissionGuideItems = remissionGuideItems
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'printer':
                    this.matDialog.open(DialogLastSalesComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })
                    break

                default:
                    break
            }
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2
                    this.products = products

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
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.remissionGuidesService.setRemissionGuideItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length || product.linkProductIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            }

            const dialogRef = this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data
            })

        } else {
            this.remissionGuidesService.addRemissionGuideItem(product)
        }
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
