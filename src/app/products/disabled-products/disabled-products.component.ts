import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryModel } from '../category.model';
import { PriceListModel } from '../price-list.model';
import { PriceType } from '../price-type.enum';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-disabled-products',
    standalone: true,
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './disabled-products.component.html',
    styleUrls: ['./disabled-products.component.sass']
})
export class DisabledProductsComponent {

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categoryId: string = ''
    categories: CategoryModel[] = []
    displayedColumns: string[] = ['name', 'feature', 'brand', 'price', 'cost', 'actions']
    dataSource: ProductModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()

    private handleSearch$: Subscription = new Subscription()
    private categories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.categories$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Productos desactivados')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        const { categoryId, pageIndex, pageSize } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0)
        this.pageSize = Number(pageSize || 10)
        this.categoryId = categoryId
        this.fetchData()
        this.fetchCount()

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        switch (this.setting.defaultPrice) {
            case PriceType.LISTA:
                this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                    this.priceLists = priceLists
                    this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
                })
                break
        }

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    switch (this.setting.defaultPrice) {
                        case PriceType.OFICINA:
                            for (const product of products) {
                                product.price = product.prices.find(e => e.officeId === this.office._id)?.price || 0
                            }
                            break
                        case PriceType.LISTA:
                            for (const product of products) {
                                const price = product.prices.find(e => e.priceListId === this.priceListId)
                                product.price = price ? price.price : product.price
                            }
                            break
                        default:
                            break
                    }
                    this.dataSource = products
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })
    }

    fetchCount() {
        this.productsService.getCountDisabledProducts().subscribe(count => {
            this.length = count
        })
    }

    fetchData(): void {
        this.navigationService.loadBarStart()
        this.productsService.getDisabledProducts(this.pageIndex + 1, this.pageSize).subscribe(products => {
            this.navigationService.loadBarFinish()
            switch (this.setting.defaultPrice) {
                case PriceType.OFICINA:
                    for (const product of products) {
                        product.price = product.prices.find(e => e.officeId === this.office._id)?.price || 0
                    }
                    break
                case PriceType.LISTA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId)
                        product.price = price ? price.price : product.price
                    }
                    break
                default:
                    break
            }

            this.dataSource = products
        })
    }

    deleteProduct(productId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.productsService.delete(productId).subscribe(() => {
                this.fetchData()
            })
        }
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
