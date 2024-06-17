import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuidesService } from '../remission-guides.service';

@Component({
    selector: 'app-edit-remission-guides',
    templateUrl: './edit-remission-guides.component.html',
    styleUrls: ['./edit-remission-guides.component.sass']
})
export class EditRemissionGuidesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    selectedIndex: number = 0
    remissionGuideItems: RemissionGuideItemModel[] = []
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleRemissionGuideItems$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleRemissionGuideItems$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        const remissionGuideId = this.activatedRoute.snapshot.params['remissionGuideId']
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe({
            next: remissionGuide => {
                this.remissionGuidesService.setRemissionGuide(remissionGuide)
                this.remissionGuidesService.setRemissionGuideItems(remissionGuide.remissionGuideItems)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })

        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Editar guia de remision')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'printer', icon: 'printer', show: false, label: 'Imprimir' }
        ])

        this.handleRemissionGuideItems$ = this.remissionGuidesService.handleRemissionGuideItems().subscribe(remissionGuideItems => {
            this.remissionGuideItems = remissionGuideItems
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

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.favorites = products
                        break
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null)
                            product.price = price ? price.price : product.price
                        }
                        this.favorites = products
                        break
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId)
                            product.price = price ? price.price : product.price
                        }
                        this.favorites = products
                        break
                }
            })
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
    }

    onChangePriceList() {
        const products = this.products
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
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.remissionGuidesService.setRemissionGuideItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length || product.linkProductIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            }

            const dialogRef = this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data
            })

        } else {
            this.remissionGuidesService.addRemissionGuideItem(product)
        }
    }

}
