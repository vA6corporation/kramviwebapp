import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { CreateSaleItemModel } from '../../sales/create-sale-item.model';
import { SalesService } from '../../sales/sales.service';
import { FavoritesService } from '../favorites.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-create-favorites',
    templateUrl: './create-favorites.component.html',
    styleUrls: ['./create-favorites.component.sass']
})
export class CreateFavoritesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
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
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Agregar favortios')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
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
                    this.selectedIndex = 1

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

        this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
            this.favorites = products
        })
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
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
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

    onRemoveFavorite(product: ProductModel) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.favoritesService.delete(product._id).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.favoritesService.loadFavorites()
                this.navigationService.showMessage('Eliminado correctamente')
            })
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (this.favorites.find(e => e._id === product._id)) {
            this.navigationService.showMessage('Este producto ya esta en favoritos')
        } else {
            this.selectedIndex = 0
            this.navigationService.loadBarStart()
            this.favoritesService.create(product._id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Favorito agregado')
                    this.favoritesService.loadFavorites()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
