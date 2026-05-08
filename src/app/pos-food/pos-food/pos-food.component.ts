import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component'
import { PriceListModel } from '../../products/price-list.model'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component'
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component'
import { SalesService } from '../../sales/sales.service'

@Component({
    selector: 'app-pos-food',
    imports: [MaterialModule, CommonModule, SaleItemsComponent, RouterModule],
    templateUrl: './pos-food.component.html',
    styleUrl: './pos-food.component.sass',
})
export class PosFoodComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly navigationService = inject(NavigationService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly productsService = inject(ProductsService)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)

    $categories = signal<CategoryModel[]>([])
    $priceLists = signal<PriceListModel[]>([])
    priceListId: string | null = null
    selectedIndex: number = 0
    $setting = signal<SettingModel>(new SettingModel())
    office: OfficeModel = new OfficeModel()
    $products = signal<ProductModel[]>([])
    private sortByName: boolean = true

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()
    private handleProducts$: Subscription = new Subscription()
    private handleAuth$eAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
        this.handleProducts$.unsubscribe()
        this.handleAuth$eAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Punto de venta')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'printer', icon: 'printer', show: false, label: 'Imprimir comprobante' },
        ])

        this.handleAuth$eAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
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

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 1

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

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
            this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
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
        ProductsService.setPrices(this.$products(), this.priceListId, this.$setting(), this.office)
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.salesService.setSaleItems([])
        }
    }

    onSelectCategory(category: CategoryModel): void {
        this.selectedIndex = 1
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

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length) {
            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
            })
        } else {
            this.salesService.addSaleItem(product)
        }
    }

}
