import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { buildExcel } from '../../buildExcel';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogAddStockComponent } from '../dialog-add-stock/dialog-add-stock.component';
import { DialogMoveStockComponent } from '../dialog-move-stock/dialog-move-stock.component';
import { DialogRemoveStockComponent } from '../dialog-remove-stock/dialog-remove-stock.component';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-inventories',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './inventories.component.html',
    styleUrls: ['./inventories.component.sass']
})
export class InventoriesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly officesService: OfficesService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        officeId: '',
        categoryId: '',
        stockState: '01',
    })
    displayedColumns: string[] = [
        'name',
        'feature',
        'brand',
        'sku',
        'upc',
        'location',
        'stock',
        'cost',
        'price',
        'actions'
    ]
    dataSource: ProductModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    categories: CategoryModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    business: BusinessModel = new BusinessModel()
    setting: SettingModel = new SettingModel()
    offices: OfficeModel[] = []
    private office: OfficeModel = new OfficeModel()
    private key: string = ''
    private params: Params = {
        state: '03'
    }

    private handleAuth$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOffices$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Inventario')

        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
            this.offices = offices
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.formGroup.patchValue({ officeId: this.office._id })
            Object.assign(this.params, { officeId: this.office._id })

            switch (this.setting.defaultPrice) {
                case PriceType.LISTAOFICINA:
                case PriceType.LISTA:
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.priceLists = priceLists
                        this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
                    })
                    break
            }

            const { categoryId, officeId, state, pageIndex, pageSize, key } = this.activatedRoute.snapshot.queryParams
            this.pageIndex = Number(pageIndex || 0)
            this.pageSize = Number(pageSize || 10)
            this.key = decodeURIComponent(key || '')
            this.formGroup.patchValue({ categoryId: categoryId || '', state: state || '01' })
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
            this.priceLists = priceLists
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            switch (id) {
                case 'excel_simple': {
                    const chunk = 500
                    const products: ProductModel[] = []

                    const dialogRef = this.matDialog.open(DialogProgressComponent, {
                        width: '600px',
                        position: { top: '20px' },
                        data: this.length / chunk
                    })

                    for (let index = 0; index < this.length / chunk; index++) {
                        const values = await lastValueFrom(this.productsService.getProductsByPage(index + 1, chunk, this.params))
                        dialogRef.componentInstance.onComplete()
                        products.push(...values)
                    }

                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
                    let body = []

                    switch (this.setting.defaultPrice) {
                        case PriceType.GLOBAL: {
                            body.push([
                                'PRODUCTO',
                                'VARIANTE',
                                'MARCA',
                                'CATEGORIA',
                                'UBICACION',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                                'PRECIO',
                                'LOTE',
                                'F. VENCIMIENTO'
                            ])

                            for (const product of products) {
                                body.push([
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
                                    product.location,
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                    Number(product.price.toFixed(2)),
                                    product.lot ? product.lot.lotNumber : null,
                                    product.lot ? formatDate(product.lot.expirationAt, 'dd/MM/yyyy', 'en-US') : null
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
                                'UBICACION',
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

                            titleRow.push('LOTE')
                            titleRow.push('F. VENCIMIENTO')

                            body.push(titleRow)

                            for (const product of products) {
                                const bodyRow = [
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
                                    product.location,
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                ]

                                for (const office of this.offices) {
                                    const price = product.prices.find(e => e.officeId === office._id && e.priceListId === null)
                                    bodyRow.push(price ? price.price : product.price)
                                }

                                if (product.lot) {
                                    bodyRow.push(product.lot.lotNumber)
                                    bodyRow.push(formatDate(product.lot.expirationAt, 'dd/MM/yyyy', 'en-US'))
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
                                'UBICACION',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                            ]

                            for (const priceList of this.priceLists) {
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
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
                                    product.location,
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                ]

                                for (const priceList of this.priceLists) {
                                    const price = product.prices.find(e => e.priceListId === priceList._id)
                                    bodyRow.push(price ? price.price : product.price)
                                }

                                if (product.lot) {
                                    bodyRow.push(product.lot.lotNumber)
                                    bodyRow.push(formatDate(product.lot.expirationAt, 'dd/MM/yyyy', 'en-US'))
                                }

                                body.push(bodyRow)
                            }
                            break
                        }
                        case PriceType.LISTAOFICINA: {

                            const titleRow = [
                                'PRODUCTO',
                                'VARIANTE',
                                'MARCA',
                                'CATEGORIA',
                                'UBICACION',
                                'C. INTERNO',
                                'C. FABRICANTE',
                                'STOCK',
                                'COSTO',
                                'VALORACION 1',
                                'VALORACION 2',
                            ]

                            for (const priceList of this.priceLists) {
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
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
                                    product.location,
                                    product.sku,
                                    product.upc,
                                    product.stock,
                                    Number(product.cost.toFixed(2)),
                                    Number((product.cost * product.stock).toFixed(2)),
                                    Number((product.price * product.stock).toFixed(2)),
                                ]

                                for (const priceList of this.priceLists) {
                                    const price = product.prices.find(e => e.priceListId === priceList._id && e.officeId === this.office._id)
                                    bodyRow.push(price ? price.price : product.price)
                                }

                                if (product.lot) {
                                    bodyRow.push(product.lot.lotNumber)
                                    bodyRow.push(formatDate(product.lot.expirationAt, 'dd/MM/yyyy', 'en-US'))
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

    onChangePriceList() {
        switch (this.setting.defaultPrice) {
            case PriceType.LISTA: {
                for (const product of this.dataSource) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId)
                    product.price = price ? price.price : product.price
                }
            }
                break
            case PriceType.LISTAOFICINA: {
                for (const product of this.dataSource) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)

                    if (price) {
                        product.price = price.price
                    } else {
                        const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                        product.price = price ? price.price : product.price
                    }
                }
            }
                break
            default:
                break
        }

    }

    onTrackStock(product: ProductModel) {
        this.navigationService.loadBarStart()
        this.productsService.updateTrackStock(product._id).subscribe(() => {
            this.navigationService.showMessage('Se han guardado los cambios')
            this.navigationService.loadBarFinish()
            this.fetchData()
        })
    }

    onAddStock(product: ProductModel) {
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

    onRemoveStock(product: ProductModel) {
        if (product.isTrackStock) {
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
        } else {
            this.navigationService.showMessage('Es necesario trakear el stock')
        }
    }

    onMoveStock(product: ProductModel) {
        if (product.isTrackStock) {
            const dialogRef = this.matDialog.open(DialogMoveStockComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        } else {
            this.navigationService.showMessage('Es necesario trakear el stock')
        }
    }

    fetchCount(): void {
        if (this.key) {
            Object.assign(this.params, { key: this.key })
            this.productsService.getCountProductsByKey(this.params).subscribe(count => {
                this.length = count
            })
        } else {
            this.productsService.getCountProducts(this.params).subscribe(count => {
                this.length = count
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
                    switch (this.setting.defaultPrice) {
                        case PriceType.OFICINA:
                            for (const product of products) {
                                product.price = product.prices.find(e => e.officeId === this.office._id)?.price || product.price
                            }
                            break
                        case PriceType.LISTA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.priceListId === this.priceListId)
                                product.price = price ? price.price : product.price
                            }
                            break
                        case PriceType.LISTAOFICINA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)

                                if (price) {
                                    product.price = price.price
                                } else {
                                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                                    product.price = price ? price.price : product.price
                                }
                            }
                            break
                        default:
                            break
                    }

                    this.dataSource = products
                    if (!products.find(e => e.feature)) {
                        const index = this.displayedColumns.findIndex(e => e === 'feature')
                        if (index >= 0) {
                            this.displayedColumns.splice(index, 1)
                        }
                    }
                    if (!products.find(e => e.brand)) {
                        const index = this.displayedColumns.findIndex(e => e === 'brand')
                        if (index >= 0) {
                            this.displayedColumns.splice(index, 1)
                        }
                    }
                    if (!products.find(e => e.location)) {
                        const index = this.displayedColumns.findIndex(e => e === 'location')
                        if (index >= 0) {
                            this.displayedColumns.splice(index, 1)
                        }
                    }
                    if (!products.find(e => e.upc)) {
                        const index = this.displayedColumns.findIndex(e => e === 'upc')
                        if (index >= 0) {
                            this.displayedColumns.splice(index, 1)
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
                switch (this.setting.defaultPrice) {
                    case PriceType.OFICINA:
                        for (const product of products) {
                            product.price = product.prices.find(e => e.officeId === this.office._id)?.price || product.price
                        }
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        break
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id)

                            if (price) {
                                product.price = price.price
                            } else {
                                const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                                product.price = price ? price.price : product.price
                            }
                        }
                        break
                    default:
                        break
                }

                this.dataSource = products
                if (!products.find(e => e.feature)) {
                    const index = this.displayedColumns.findIndex(e => e === 'feature')
                    if (index >= 0) {
                        this.displayedColumns.splice(index, 1)
                    }
                }
                if (!products.find(e => e.brand)) {
                    const index = this.displayedColumns.findIndex(e => e === 'brand')
                    if (index >= 0) {
                        this.displayedColumns.splice(index, 1)
                    }
                }
                if (!products.find(e => e.location)) {
                    const index = this.displayedColumns.findIndex(e => e === 'location')
                    if (index >= 0) {
                        this.displayedColumns.splice(index, 1)
                    }
                }
                if (!products.find(e => e.upc)) {
                    const index = this.displayedColumns.findIndex(e => e === 'upc')
                    if (index >= 0) {
                        this.displayedColumns.splice(index, 1)
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
        const { stockState } = this.formGroup.value
        const queryParams: Params = { stockState, pageIndex: 0 }
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
