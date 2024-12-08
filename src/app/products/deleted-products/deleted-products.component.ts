import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    selector: 'app-deleted-products',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './deleted-products.component.html',
    styleUrls: ['./deleted-products.component.sass']
})
export class DeletedProductsComponent {

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categoryId: string = ''
    categories: CategoryModel[] = []
    displayedColumns: string[] = ['name', 'feature', 'brand', 'stock', 'actions']
    dataSource: ProductModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()

    private categories$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.categories$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Productos eliminados')

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

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    console.log(products)
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

    onRestoreAll() {
        const ok = confirm('Esta seguro de restablecer todos los productos')
        if (ok) {
            this.navigationService.loadBarStart()
            this.productsService.restoreAll().subscribe(() => {
                this.navigationService.showMessage('Los productos han sido restablecidos')
                this.navigationService.loadBarFinish()
                this.fetchData()
            })
        }
    }

    fetchData(): void {
        this.navigationService.loadBarStart()
        this.productsService.getDeletedProducts(this.pageIndex + 1, this.pageSize).subscribe(products => {
            this.navigationService.loadBarFinish()
            this.dataSource = products
        })
    }

    fetchCount() {
        this.productsService.getCountDeletedProducts().subscribe(count => {
            this.length = count
        })
    }

    restoreProduct(productId: string) {
        this.navigationService.loadBarStart()
        this.productsService.restore(productId).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.dataSource = this.dataSource.filter(e => e._id !== productId)
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
