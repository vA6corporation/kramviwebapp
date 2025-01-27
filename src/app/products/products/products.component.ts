import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { SheetPrintBarcodesComponent } from '../sheet-print-barcodes/sheet-print-barcodes.component';
import { PriceType } from '../price-type.enum';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../categories.service';
import { AuthService } from '../../auth/auth.service';
import { CategoryModel } from '../category.model';
import { PriceListModel } from '../price-list.model';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';
import { buildExcel } from '../../buildExcel';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { MaterialModule } from '../../material.module';
import { DialogPasswordComponent } from '../../boards/dialog-password/dialog-password.component';

@Component({
    selector: 'app-products',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, RouterModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.sass']
})
export class ProductsComponent {

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly bottomSheet: MatBottomSheet,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
    })
    categories: CategoryModel[] = []
    displayedColumns: string[] = [
        'checked',
        'name',
        'feature',
        'brand',
        'sku',
        'upc',
        'location',
        'cost',
        'price',
        'stock',
        'actions'
    ]
    dataSource: ProductModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    setting: SettingModel = new SettingModel()
    productsId: string[] = []
    private office: OfficeModel = new OfficeModel()
    private offices: OfficeModel[] = []
    private key: string = ''
    private params: Params = {}

    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleOffices$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleOffices$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Productos')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'export_products', icon: 'download', show: false, label: 'Exportar a excel' },
            { id: 'print_barcodes', icon: 'qr_code', show: false, label: 'Codigo de barras' }
        ])

        this.handleOffices$ = this.authService.handleOffices().subscribe(offices => {
            this.offices = offices
        })

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
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

            const { categoryId, pageIndex, pageSize, key } = this.activatedRoute.snapshot.queryParams
            this.pageIndex = Number(pageIndex || 0)
            this.pageSize = Number(pageSize || 10)
            this.key = decodeURIComponent(key || '')
            this.formGroup.patchValue({
                categoryId: categoryId || '',
            })
            Object.assign(this.params, {
                categoryId: categoryId || '',
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
                        data: this.length / chunk
                    })

                    for (let index = 0; index < this.length / chunk; index++) {
                        const values = await lastValueFrom(this.productsService.getProductsByPage(index + 1, chunk, {}))
                        dialogRef.componentInstance.onComplete()
                        products.push(...values)
                    }

                    if (this.productsId.length) {
                        products = products.filter(e => this.productsId.includes(e._id))
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
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
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
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
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

                            for (const priceList of this.priceLists) {
                                titleRow.push(priceList.name.toUpperCase())
                            }

                            body.push(titleRow)

                            for (const product of products) {
                                const bodyRow = [
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
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

                            body.push(titleRow)

                            for (const product of products) {

                                const bodyRow = [
                                    product.name.toUpperCase(),
                                    (product.feature || '').toUpperCase(),
                                    (product.brand || '').toUpperCase(),
                                    (this.categories.find(e => e._id === product.categoryId)?.name || '').toUpperCase(),
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

    checkProductId(isChecked: boolean, productId: string) {
        if (isChecked) {
            this.productsId.push(productId)
        } else {
            const index = this.productsId.indexOf(productId)
            if (index > -1) {
                this.productsId.splice(index, 1)
            }
        }
    }

    checkAllProducts(isChecked: boolean) {
        if (isChecked) {
            this.productsId = []
            this.productsId = this.dataSource.map(e => e._id)
        } else {
            this.productsId = []
        }
    }

    fetchCount() {
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
        this.productsId = []
        if (this.key) {
            this.navigationService.loadBarStart()
            Object.assign(this.params, { key: this.key })
            this.productsService.getProductsByKeyPage(this.pageIndex + 1, this.pageSize, this.params).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
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
                    if (!products.find(e => e.sku)) {
                        const index = this.displayedColumns.findIndex(e => e === 'sku')
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
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
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
                if (!products.find(e => e.sku)) {
                    const index = this.displayedColumns.findIndex(e => e === 'sku')
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

    onEditProduct(productId: string) {
        if (this.setting.password && this.setting.isBlockEditProducts) {
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
        this.bottomSheet.open(SheetPrintBarcodesComponent, { data: [product] })
    }

    onPrintBarcodeMassive() {
        if (!this.productsId.length) {
            alert('Debes seleccionar almenos 1 producto')
        } else {
            const products = this.dataSource.filter(e => this.productsId.includes(e._id))
            this.bottomSheet.open(SheetPrintBarcodesComponent, { data: products })
        }
    }

    onChangePriceList() {
        ProductsService.setPrices(this.dataSource, this.priceListId, this.setting, this.office)
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
