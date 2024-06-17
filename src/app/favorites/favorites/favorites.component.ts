import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { FavoritesService } from '../favorites.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.sass']
})
export class FavoritesComponent implements OnInit {

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly favoritesService: FavoritesService,
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

    private handleSearch$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Productos')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting

            switch (this.setting.defaultPrice) {
                case PriceType.LISTAOFICINA:
                case PriceType.LISTA:
                    this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
                        this.priceLists = priceLists
                        this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
                    })
                    break
            }
        })

        this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(favorites => {
            this.dataSource = favorites
        })
    }

    onDeleteFavorite(productId: string) {
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.favoritesService.delete(productId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.favoritesService.loadFavorites()
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

    onChangePriceList() {
        for (const product of this.dataSource) {
            const price = product.prices.find(e => e.priceListId === this.priceListId)
            product.price = price ? price.price : product.price
        }
    }

    onChangeCategory() {
        this.pageIndex = 0

        const queryParams: Params = { categoryId: this.categoryId, pageIndex: this.pageIndex }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
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
    }

}
