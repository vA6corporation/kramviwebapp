import { Component, inject, signal } from '@angular/core'
import { CommonModule, formatDate } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router'
import { Subscription, lastValueFrom } from 'rxjs'
import { ProductModel } from '../product.model'
import { ProductsService } from '../products.service'
import { SheetPrintBarcodesComponent } from '../sheet-print-barcodes/sheet-print-barcodes.component'
import { PriceType } from '../price-type.enum'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoriesService } from '../categories.service'
import { AuthService } from '../../auth/auth.service'
import { CategoryModel } from '../category.model'
import { PriceListModel } from '../price-list.model'
import { SettingModel } from '../../settings/setting.model'
import { OfficeModel } from '../../offices/office.model'
import { BusinessModel } from '../../businesses/business.model'
import { buildExcel } from '../../buildExcel'
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component'
import { MaterialModule } from '../../material.module'
import { BusinessType } from '../../businesses/business.model'
import { DialogPasswordComponent } from '../../sales/dialog-password/dialog-password.component'
import { ProvidersService } from '../../providers/providers.service'
import { ProviderModel } from '../../providers/provider.model'

@Component({
    selector: 'app-products',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly matBottomSheet = inject(MatBottomSheet)
    private readonly productsService = inject(ProductsService)
    private readonly navigationService = inject(NavigationService)
    private readonly categoriesService = inject(CategoriesService)
    private readonly providersService = inject(ProvidersService)
    private readonly authService = inject(AuthService)

    formGroup: FormGroup = this.formBuilder.group({
        officeId: '',
        categoryId: '',
        providerId: '',
        stockState: '',
    })
    $categories = signal<CategoryModel[]>([])
    $providers = signal<ProviderModel[]>([])
    preDisplayedColumns: string[] = [
        'checked',
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
        'checked',
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
    $length = signal(0)
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    $priceLists = signal<PriceListModel[]>([])
    priceListId: any | null = null
    $setting = signal<SettingModel>(new SettingModel())
    $offices = signal<OfficeModel[]>([])
    productIds: number[] = []
    private office: OfficeModel = new OfficeModel()
    private business: BusinessModel = new BusinessModel()
    private offices: OfficeModel[] = []
    private key: string = ''
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleProviders$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleOffices$.unsubscribe()
        this.handleProviders$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Productos')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'export_products', icon: 'download', show: false, label: 'Exportar a excel' },
            { id: 'print_barcodes', icon: 'qr_code', show: false, label: 'Codigo de barras' },
        ])

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.$offices.set(offices)
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.$categories.set(categories)
        })

        this.handleProviders$ = this.providersService.handleProviders().subscribe(providers => {
            this.$providers.set(providers)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$setting.set(auth.setting)
            this.office = auth.office
            this.business = auth.business

            switch (this.$setting().defaultPrice) {
                case PriceType.LISTA:
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.$priceLists.set(priceLists)
                        this.priceListId = this.$setting().defaultPriceListId || priceLists[0]?.id
                    })
                    break
            }

            const { categoryId, officeId, providerId, state, pageIndex, pageSize, key } = this.activatedRoute.snapshot.queryParams

            this.pageIndex = Number(pageIndex || 0)
            this.pageSize = Number(pageSize || 10)
            this.key = decodeURIComponent(key || '')

            this.formGroup.patchValue({
                providerId: providerId ? Number(providerId) : '',
                categoryId: categoryId ? Number(categoryId) : '',
                officeId: officeId ? Number(officeId) : this.office.id,
                state: state || '01'
            })

            Object.assign(this.params, {
                providerId: providerId || '',
                categoryId: categoryId || '',
                officeId: officeId || this.office.id,
                state: state || '01'
            })

            this.fetchCount()
            this.fetchData()
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'print_barcodes':
                    this.onPrintBarcodeMassive()
                    break

                default:
                    const chunk = 500
                    let products: ProductModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.$length() / chunk
                    })

                    for (let index = 0; index < this.$length() / chunk; index++) {
                        const values = await lastValueFrom(this.productsService.getProductsByPage(index + 1, chunk, {}))
                        dialogRef.componentInstance.onComplete()
                        products.push(...values)
                    }

                    if (this.productIds.length) {
                        products = products.filter(e => this.productIds.includes(e.id))
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []

                    switch (this.$setting().defaultPrice) {
                        case PriceType.GLOBAL: {
                            body.push([
                                'ID',
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
                                body.push([
                                    product.id,
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

                            for (const office of this.offices) {
                                titleRow.push(`precio ${office.name.toUpperCase()}`)
                            }

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

                                for (const office of this.offices) {
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
                    break
            }
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {

            this.pageIndex = 0
            this.key = key

            const queryParams: Params = { key, categoryId: null }

            Object.assign(this.params, { categoryId: null })

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: queryParams,
                queryParamsHandling: 'merge', // remove to replace all query params by provided
            })

            this.fetchData()
            this.fetchCount()
        })
    }

    checkProductId(isChecked: boolean, productId: any) {
        if (isChecked) {
            this.productIds.push(productId)
        } else {
            const index = this.productIds.indexOf(productId)
            if (index > -1) {
                this.productIds.splice(index, 1)
            }
        }
    }

    checkAllProducts(isChecked: boolean) {
        if (isChecked) {
            this.productIds = []
            this.productIds = this.$dataSource().map(e => e.id)
        } else {
            this.productIds = []
        }
    }

    fetchCount() {
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
        this.productIds = []
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

                    if (!products.find(e => e.provider)) {
                        const index = this.$displayedColumns().findIndex(e => e === 'provider')
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

                if (!products.find(e => e.provider)) {
                    const index = this.$displayedColumns().findIndex(e => e === 'provider')
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

    onDeleteProduct(productId: any) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.productsService.delete(productId).subscribe(() => {
                this.navigationService.showMessage('Eliminado correctamente')
                this.fetchData()
            })
        }
    }

    onEditProduct(productId: any) {
        if (this.$setting().password) {
            const dialogRef = this.matDialog.open(DialogPasswordComponent, {
                width: '600px',
                position: { top: '20px' },
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.router.navigate(['/products', productId, 'edit'])
                }
            })
        } else {
            this.router.navigate(['/products', productId, 'edit'])
        }
    }

    onPrintBarcode(product: ProductModel) {
        this.matBottomSheet.open(SheetPrintBarcodesComponent, { data: [product] })
    }

    onPrintBarcodeMassive() {
        if (!this.productIds.length) {
            alert('Debes seleccionar almenos 1 producto')
        } else {
            const products = this.$dataSource().filter(e => this.productIds.includes(e.id))
            this.matBottomSheet.open(SheetPrintBarcodesComponent, { data: products })
        }
    }

    onChangePriceList() {
        ProductsService.setPrices(this.$dataSource(), this.priceListId, this.$setting(), this.office)
    }

    onCategoryChange() {
        const { categoryId } = this.formGroup.value
        this.pageIndex = 0
        this.key = ''
        const queryParams: Params = { categoryId, pageIndex: this.pageIndex, key: null }
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
