import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { LotModel } from '../../lots/lot.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogSaleItemsComponent } from '../../sales/dialog-sale-items/dialog-sale-items.component';
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-pos-standard-edit',
    imports: [MaterialModule, CommonModule, RouterModule, SaleItemsComponent],
    templateUrl: './pos-standard-edit.component.html',
    styleUrls: ['./pos-standard-edit.component.sass']
})
export class PosStandardEditComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
        private readonly categoriesService: CategoriesService,
    ) { }

    saleId: string = ''
    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    selectedIndex: number = 0
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    isLoading: boolean = true
    lots: LotModel[] = []
    private sale: SaleModel | null = null
    private sortByName: boolean = true

    private handleSearch$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleCategories$.unsubscribe()
    }

    ngOnInit(): void {
        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.isLoading = false
            this.sale = sale
            if (this.sale.isCredit) {
                this.navigationService.showDialogMessage('Esta venta a sido generada al credito, debera revisar las cuotas pagadas si hace una modificacion')
            }
            this.salesService.setSale(sale)
            this.navigationService.setTitle(`Editar venta ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
            this.salesService.setSaleItems(this.sale.saleItems)
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.navigationService.showSearch()

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                this.favorites = products
            })
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2
                    ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                    this.products = products

                    if (this.sortByName) {
                        this.products.sort((a, b) => {
                            if (a.fullName > b.fullName) {
                                return 1
                            }
                            if (a.fullName < b.fullName) {
                                return -1
                            }
                            return 0
                        })
                    } else {
                        this.products.sort((a, b) => b.price - a.price)
                    }

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

    onChangePriceList() {
        ProductsService.setPrices(this.products, this.priceListId, this.setting, this.office)
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.salesService.setSaleItems([])
        }
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

    onRightClick(product: ProductModel) {
        this.matDialog.open(DialogDetailProductsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: product,
        })
        return false
    }

    onSelectProduct(product: ProductModel, event?: MouseEvent): void {
        if (product.annotations.length || product.linkProductIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            }
            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            })
        } else {
            if (event && event.ctrlKey) {
                const index = this.salesService.forceAddSaleItem(product)
                this.matDialog.open(DialogSaleItemsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: index,
                })
            } else {
                this.salesService.addSaleItem(product)
            }
        }
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            const products = category.products
            ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
            this.products = products

            if (this.sortByName) {
                this.products.sort((a, b) => {
                    if (a.fullName > b.fullName) {
                        return 1
                    }
                    if (a.fullName < b.fullName) {
                        return -1
                    }
                    return 0
                })
            } else {
                this.products.sort((a, b) => b.price - a.price)
            }

        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                this.products = products

                if (this.sortByName) {
                    this.products.sort((a, b) => {
                        if (a.fullName > b.fullName) {
                            return 1
                        }
                        if (a.fullName < b.fullName) {
                            return -1
                        }
                        return 0
                    })
                } else {
                    this.products.sort((a, b) => b.price - a.price)
                }
            })
        }
    }

}
