import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../products/categories.service';
import { FavoritesService } from '../../favorites/favorites.service';
import { SalesService } from '../../sales/sales.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { PriceListModel } from '../../products/price-list.model';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';
import { LotModel } from '../../lots/lot.model';
import { PriceType } from '../../products/price-type.enum';
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component';
import { DialogSaleItemsComponent } from '../../sales/dialog-sale-items/dialog-sale-items.component';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component';

@Component({
    selector: 'app-pos-standard',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterModule, SaleItemsComponent],
    templateUrl: './pos-standard.component.html',
    styleUrls: ['./pos-standard.component.sass']
})
export class PosStandardComponent implements OnInit {

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
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    lots: LotModel[] = []
    private sortByName: boolean = true

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
            { id: 'sort', icon: 'sort_by_alpha', show: true, label: '' },
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'printer', icon: 'printer', show: false, label: 'Imprimir comprobante' },
            // { id: 'promotions', icon: 'printer', show: false, label: 'Agregar una promocion' }
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

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            switch (id) {
                case 'printer':
                    this.matDialog.open(DialogLastSalesComponent, {
                        width: '600px',
                        position: { top: '20px' },
                    })
                    break
                case 'sort':
                    this.sortByName = !this.sortByName
                    if (this.sortByName) {
                        this.navigationService.showMessage('Orden por nombre')
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
                        this.navigationService.showMessage('Orden por precio')
                        this.products.sort((a, b) => b.price - a.price)
                    }
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

    onSelectSaleItem(index: number) {
        this.matDialog.open(DialogSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
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
        const favorites = this.favorites
        switch (this.setting.defaultPrice) {
            case PriceType.GLOBAL:
                this.products = products
                this.favorites = favorites
                break
            case PriceType.OFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                    product.price = price ? price.price : product.price
                }
                for (const product of favorites) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                this.favorites = favorites
                break
            case PriceType.LISTA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId)
                    product.price = price ? price.price : product.price
                }
                for (const product of favorites) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                this.favorites = favorites
                break
            case PriceType.LISTAOFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                    product.price = price ? price.price : product.price
                }
                for (const product of favorites) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)
                    product.price = price ? price.price : product.price
                }
                this.products = products
                this.favorites = favorites
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

}