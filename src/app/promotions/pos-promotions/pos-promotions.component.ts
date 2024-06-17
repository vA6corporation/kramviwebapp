import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component';
import { DialogSaleItemsComponent } from '../../sales/dialog-sale-items/dialog-sale-items.component';
import { SalesService } from '../../sales/sales.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-pos-promotions',
    templateUrl: './pos-promotions.component.html',
    styleUrls: ['./pos-promotions.component.sass']
})
export class PosPromotionsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly categoriesService: CategoriesService,
        private readonly favoritesService: FavoritesService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    enviroment = environment
    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    selectedIndex: number = 0
    saleItems: CreateSaleItemModel[] = []
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Punto de venta')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'printer', icon: 'printer', show: false, label: 'Imprimir comprobante' },
            { id: 'promotions', icon: 'printer', show: false, label: 'Agregar una promocion' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.favorites = products
                        break
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                            product.price = price ? price.price : product.price
                        }
                        this.favorites = products
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        this.favorites = products
                        break
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                            product.price = price ? price.price : product.price
                        }
                        this.favorites = products
                        break
                }
            })
        })

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
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

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                this.navigationService.loadBarFinish()
                this.selectedIndex = 2

                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.products = products
                        break
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
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

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            const products = category.products

            switch (this.setting.defaultPrice) {
                case PriceType.GLOBAL:
                    this.products = products
                    break
                case PriceType.OFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
                case PriceType.LISTA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
                case PriceType.LISTAOFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                        product.price = price ? price.price : product.price
                    }
                    this.products = products
                    break
            }
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products

                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.products = products
                        break
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                            product.price = price ? price.price : product.price
                        }
                        this.products = products
                        break
                }
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

    onChangePriceList() {
        const products = this.products
        switch (this.setting.defaultPrice) {
            case PriceType.GLOBAL:
                this.products = products
                break
            case PriceType.OFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
            case PriceType.LISTA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
            case PriceType.LISTAOFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                break
        }
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.salesService.setSaleItems([])
        }
    }

    onSelectProduct(product: ProductModel, event?: MouseEvent): void {
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
            const index = this.salesService.addSaleItem(product)

            if (event && event.ctrlKey) {
                this.matDialog.open(DialogSaleItemsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: index,
                })
            }
        }
    }

}
