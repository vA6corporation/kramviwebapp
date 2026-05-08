import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { buildExcel } from '../../buildExcel'
import { MaterialModule } from '../../material.module'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { CategoriesService } from '../../products/categories.service'
import { CategoryModel } from '../../products/category.model'
import { PriceListModel } from '../../products/price-list.model'
import { PriceType } from '../../products/price-type.enum'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component'
import { DialogRemoveStockComponent } from '../dialog-remove-stock/dialog-remove-stock.component'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { SheetAddStockComponent } from '../sheet-add-stock/sheet-add-stock.component'
import { DialogCreatePurchaseComponent } from '../dialog-create-purchase/dialog-create-purchase.component'
import { DialogProductProvidersComponent } from '../../providers/dialog-product-providers/dialog-product-providers.component'
import { DialogPasswordComponent } from '../../boards/dialog-password/dialog-password.component'
import { BusinessType } from '../../businesses/business.model'
import { ProvidersService } from '../../providers/providers.service'
import { ProviderModel } from '../../providers/provider.model'

@Component({
    selector: 'app-inventories',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './inventories.component.html',
    styleUrls: ['./inventories.component.sass']
})
export class InventoriesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly matBottomSheet = inject(MatBottomSheet)
    private readonly productsService = inject(ProductsService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly navigationService = inject(NavigationService)
    private readonly officesService = inject(OfficesService)
    private readonly providersService = inject(ProvidersService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        officeId: '',
        categoryId: '',
        providerId: '',
        stockState: '',
    })
    $providers = signal<ProviderModel[]>([])
    preDisplayedColumns: string[] = [
        'name',
        'feature',
        'brand',
        'category',
        'sku',
        'upc',
        'cost',
        'price',
        'stock',
        'minimumStock',
        'comanda',
        'provider',
        'actions'
    ]
    $displayedColumns = signal<string[]>([
        'name',
        'feature',
        'brand',
        'category',
        'sku',
        'upc',
        'cost',
        'price',
        'stock',
        'minimumStock',
        'comanda',
        'provider',
        'actions'
    ])
    $dataSource = signal<ProductModel[]>([])
    $length = signal<number>(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $categories = signal<CategoryModel[]>([])
    $priceLists = signal<PriceListModel[]>([])
    priceListId: string | null = null
    business: BusinessModel = new BusinessModel()
    $setting = signal<SettingModel>(new SettingModel())
    $offices = signal<OfficeModel[]>([])
    private office: OfficeModel = new OfficeModel()
    private key: string = ''
    private params: Params = {
        state: '03'
    }

    private handleAuth$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleProviders$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleProviders$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Inventario')

        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleProviders$ = this.providersService.handleProviders().subscribe(providers => {
            this.$providers.set(providers)
        })

        this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
            this.$offices.set(offices)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
            this.business = auth.business

            this.formGroup.patchValue({ officeId: this.office.id })
            Object.assign(this.params, { officeId: this.office.id })

            switch (this.$setting().defaultPrice) {
                case PriceType.LISTA:
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                    this.$priceLists.set(priceLists)
                    this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
                })
                break
            }

            const { categoryId, officeId, state, pageIndex, pageSize, key } = this.activatedRoute.snapshot.queryParams

            this.pageIndex = Number(pageIndex || 0)
            this.pageSize = Number(pageSize || 10)
            this.key = decodeURIComponent(key || '')
            this.formGroup.patchValue({ categoryId: categoryId ? Number(categoryId) : '', state: state || '01' })
            Object.assign(this.params, { categoryId: categoryId || '', state: state || '01' })
            if (officeId) {
                Object.assign(this.params, { officeId })
                this.formGroup.patchValue({ officeId })
            }
            this.fetchData()
            this.fetchCount()
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.pageIndex = 0
            this.key = key
            const queryParams: Params = { key, categoryId: null }

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.$priceLists.set(priceLists)
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'excel_simple': {
                    const chunk = 500
                    const products: ProductModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.$length() / chunk
                    })

                    for (let index = 0; index < this.$length() / chunk; index++) {
                        const values = await lastValueFrom(this.productsService.getProductsByPage(index + 1, chunk, this.params))
                        dialogRef.componentInstance.onComplete()
                        products.push(...values)
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []
                    let totalCost = 0
                    let totalPrice = 0

                    switch (this.$setting().defaultPrice) {
                        case PriceType.GLOBAL: {
                            body.push([
                                'PRODUCTO',
                                'VARIANTE',
                                'MARCA',
                                'CATEGORIA',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                                'PRECIO',
                            ])

                            for (const product of products) {
                                totalCost += product.cost * product.stock
                                totalPrice += product.price * product.stock
                                body.push([
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.$categories().find(e => e.id === product.categoryId)?.name || '').toUpperCase(),
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                    Number(product.price.toFixed(2)),
                                ])
                            }

                            body.push(['', '', '', '', '', '', '', '', '', Number(totalCost.toFixed(2)), Number(totalPrice.toFixed(2))])
                            break
                        }
                        case PriceType.OFICINA: {

                            const titleRow = [
                                'PRODUCTO',
                                'VARIANTE',
                                'MARCA',
                                'CATEGORIA',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                            ]

                            for (const office of this.$offices()) {
                                titleRow.push(`precio ${office.name.toUpperCase()}`)
                            }

                            titleRow.push('LOTE')
                            titleRow.push('F. VENCIMIENTO')

                            body.push(titleRow)

                            for (const product of products) {
                                const bodyRow = [
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.$categories().find(e => e.id === product.categoryId)?.name || '').toUpperCase(),
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                ]

                                for (const office of this.$offices()) {
                                    const price = product.prices.find(e => e.officeId === office.id && e.priceListId === null)
                                    bodyRow.push(price ? price.price : product.price)
                                }

                                body.push(bodyRow)
                            }
                            break
                        }
                        case PriceType.LISTA: {

                            const titleRow = [
                                'PRODUCTO',
                                'VARIANTE',
                                'MARCA',
                                'CATEGORIA',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                            ]

                            for (const priceList of this.$priceLists()) {
                                titleRow.push(priceList.name.toUpperCase())
                            }

                            titleRow.push('LOTE')
                            titleRow.push('F. VENCIMIENTO')

                            body.push(titleRow)

                            for (const product of products) {
                                const bodyRow = [
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.$categories().find(e => e.id === product.categoryId)?.name || '').toUpperCase(),
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                ]

                                for (const priceList of this.$priceLists()) {
                                    const price = product.prices.find(e => e.priceListId === priceList.id)
                                    bodyRow.push(price ? price.price : product.price)
                                }

                                body.push(bodyRow)
                            }
                            break
                        }
                        default:
                            break
                    }

                    const name = `INVENTARIO_${formatDate(new Date(), 'dd/MM/yyyy', 'en-US')}`
                    buildExcel(body, name, wscols, [], [])
                }
            }
        })
    }

    onProvidersProduct(providerIds: string[]) {
        this.matDialog.open(DialogProductProvidersComponent, {
            width: '600px',
            position: { top: '20px' },
            data: providerIds
        })
    }

    onChangePriceList() {
        ProductsService.setPrices(this.$dataSource(), this.priceListId, this.$setting(), this.office)
    }

    onTrackStock(product: ProductModel) {
        this.navigationService.loadBarStart()
        this.productsService.updateTrackStock(product.id).subscribe(() => {
            this.navigationService.showMessage('Se han guardado los cambios')
            this.navigationService.loadBarFinish()
            this.fetchData()
        })
    }

    onAddStock(product: ProductModel) {
        if (this.$setting().password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    const dialogRef = this.matDialog.open(DialogAddStockComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: product,
                    })

                    dialogRef.afterClosed().subscribe(ok => {
                        if (ok) {
                            this.fetchData()
                        }
                    })
                }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogAddStockComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        }
    }

    onEditStock(product: ProductModel) {
        const matBottomSheetRef = this.matBottomSheet.open(SheetAddStockComponent)
        matBottomSheetRef.instance.handleAddStock().subscribe(() => {
            this.onAddStock(product)
        })

        matBottomSheetRef.instance.handleRemoveStock().subscribe(() => {
            this.onRemoveStock(product)
        })
    }

    onPurchaseStock(product: ProductModel) {
        if (this.$setting().password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    const dialogRef = this.matDialog.open(DialogCreatePurchaseComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: product,
                    })

                    dialogRef.afterClosed().subscribe(ok => {
                        if (ok) {
                            this.fetchData()
                        }
                    })
                }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogCreatePurchaseComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        }
    }

    onRemoveStock(product: ProductModel) {
        if (this.$setting().password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    const dialogRef = this.matDialog.open(DialogRemoveStockComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: product,
                    })

                    dialogRef.afterClosed().subscribe(ok => {
                        if (ok) {
                            this.fetchData()
                        }
                    })
                }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogRemoveStockComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        }
    }

    fetchCount(): void {
        if (this.key) {
            Object.assign(this.params, { key: this.key })
            this.productsService.getCountProductsByKey(this.params).subscribe(count => {
                this.$length.set(count)
            })
        } else {
            this.productsService.getCountProducts(this.params).subscribe(count => {
                this.$length.set(count)
            })
        }
    }

    fetchData(): void {
        this.navigationService.loadBarStart()
        if (this.key) {
            this.navigationService.loadBarStart()
            Object.assign(this.params, { key: this.key })
            this.productsService.getProductsByKeyPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                    this.$dataSource.set(products)
                    this.$displayedColumns.set(Array.from(this.preDisplayedColumns))

                    if (this.business.businessType === BusinessType.STORE) {
                        const index = this.$displayedColumns().findIndex(e => e === 'comanda')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                    if (!products.find(e => e.feature)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'feature')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                    if (!products.find(e => e.brand)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'brand')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                    if (!products.find(e => e.sku)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'sku')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                    if (!products.find(e => e.upc)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'upc')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                    if (!products.find(e => e.minimumStock)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'minimumStock')
                        if (index >= 0) {
                            this.$displayedColumns.update(values => {
                                values.splice(index, 1)
                                return values
                            })
                        }
                    }

                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                    this.navigationService.loadBarFinish()
                }
            })
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(products => {
                this.navigationService.loadBarFinish()
                ProductsService.setPrices(products, this.priceListId, this.$setting(), this.office)
                this.$dataSource.set(products)
                this.$displayedColumns.set(Array.from(this.preDisplayedColumns))

                if (this.business.businessType === BusinessType.STORE) {
                    const index = this.$displayedColumns().findIndex(e => e === 'comanda')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

                if (!products.find(e => e.feature)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'feature')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

                if (!products.find(e => e.brand)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'brand')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

                if (!products.find(e => e.sku)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'sku')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

                if (!products.find(e => e.upc)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'upc')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

                if (!products.find(e => e.minimumStock)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'minimumStock')
                    if (index >= 0) {
                        this.$displayedColumns.update(values => {
                            values.splice(index, 1)
                            return values
                        })
                    }
                }

            })
        }
    }

    onDeleteProduct(productId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.productsService.delete(productId).subscribe(() => {
                this.fetchData()
            })
        }
    }

    onStockStateChange() {
        this.pageIndex = 0
        this.key = ''
        const { stockState } = this.formGroup.value
        const queryParams: Params = { stockState, pageIndex: 0, key: null }
        Object.assign(this.params, { stockState })
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
        this.fetchData()
        this.fetchCount()
    }

    onCategoryChange() {
        this.pageIndex = 0
        this.key = ''
        const { categoryId } = this.formGroup.value
        const queryParams: Params = { categoryId, pageIndex: this.pageIndex }
        Object.assign(this.params, { categoryId })
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    onOfficeChange() {
        const { officeId } = this.formGroup.value
        const queryParams: Params = { officeId }
        Object.assign(this.params, { officeId })
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
        this.fetchData()
        this.fetchCount()
    }

    onProviderChange() {
        const { providerId } = this.formGroup.value
        this.pageIndex = 0
        this.key = ''
        const queryParams: Params = { providerId, pageIndex: this.pageIndex, key: null }
        Object.assign(this.params, { providerId })
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
        this.fetchData()
    }

}
