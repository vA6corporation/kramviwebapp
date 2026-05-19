import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { FavoritesService } from '../../favorites/favorites.service'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component'
import { DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component'
import { PriceListModel } from '../../products/price-list.model'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogSaleItemsComponent } from '../../sales/dialog-sale-items/dialog-sale-items.component'
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component'
import { SaleModel } from '../../sales/sale.model'
import { SalesService } from '../../sales/sales.service'

@Component({
    selector: 'app-pos-standard-edit',
    imports: [MaterialModule, CommonModule, RouterModule, SaleItemsComponent],
    templateUrl: './pos-standard-edit.component.html',
    styleUrls: ['./pos-standard-edit.component.sass']
})
export class PosStandardEditComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)
    private readonly matDialog = inject(MatDialog)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly categoriesService = inject(CategoriesService)

    $saleId = signal<string>('')
    $categories = signal<CategoryModel[]>([])
    $products = signal<ProductModel[]>([])
    $favorites = signal<ProductModel[]>([])
    $priceLists = signal<PriceListModel[]>([])
    priceListId: string | null = null
    selectedIndex: number = 0
    $setting = signal<SettingModel>(new SettingModel())
    office: OfficeModel = new OfficeModel()
    $isLoading = signal<boolean>(true)
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
        const saleId = this.activatedRoute.snapshot.params['saleId']
        this.$saleId.set(saleId)
        this.salesService.getSaleById(saleId).subscribe(sale => {
            this.$isLoading.set(false)
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
            this.$categories.set(categories)
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
            this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                this.$favorites.set(products)
            })
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2

                    ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)

                    if (this.sortByName) {
                       products.sort((a, b) => {
                            if (a.fullName > b.fullName) {
                                return 1
                            }
                            if (a.fullName < b.fullName) {
                                return -1
                            }
                            return 0
                        })
                    } else {
                        products.sort((a, b) => b.price - a.price)
                    }

                    this.$products.set(products)

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
        ProductsService.setPrices(this.$products(), this.priceListId, this.$setting(), this.office)
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
        if (product.annotations.length) {
            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
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
        this.$products.set([])
        if (category.products) {
            const products = category.products
            ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)

            if (this.sortByName) {
                products.sort((a, b) => {
                    if (a.fullName > b.fullName) {
                        return 1
                    }
                    if (a.fullName < b.fullName) {
                        return -1
                    }
                    return 0
                })
            } else {
                products.sort((a, b) => b.price - a.price)
            }

            this.$products.set(products)
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category.id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)

                if (this.sortByName) {
                    products.sort((a, b) => {
                        if (a.fullName > b.fullName) {
                            return 1
                        }
                        if (a.fullName < b.fullName) {
                            return -1
                        }
                        return 0
                    })
                } else {
                    products.sort((a, b) => b.price - a.price)
                }

                this.$products.set(products)
            })
        }
    }

}
