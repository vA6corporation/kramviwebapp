import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { CreateEventItemModel } from '../create-event-item.model';
import { EventItemsComponent } from '../event-items/event-items.component';
import { EventsService } from '../events.service';

@Component({
    selector: 'app-edit-item-events',
    imports: [MaterialModule, EventItemsComponent, RouterModule],
    templateUrl: './edit-item-events.component.html',
    styleUrls: ['./edit-item-events.component.sass'],
})
export class EditItemEventsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly eventsService: EventsService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    gridListCols = 4
    selectedIndex: number = 0
    eventItems: CreateEventItemModel[] = []
    setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()
    private sortByName: boolean = true

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleEventItems$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleEventItems$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar agenda')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            // { id: 'printer', icon: 'printer', show: false, label: 'Reimprimir' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.handleEventItems$ = this.eventsService.handleEventItems().subscribe(eventItems => {
            this.eventItems = eventItems
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                this.favorites = products
            })
        })

        const eventId = this.activatedRoute.snapshot.params['eventId']
        this.eventsService.getEventById(eventId).subscribe(event => {
            this.eventsService.setEventItems(event.eventItems)
            this.eventsService.setEvent(event)
        })

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2
                    ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                    this.products = products

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

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            const products = category.products
            ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
            this.products = products

            if (this.sortByName) {
                this.products.sort((a, b) => {
                    if (a.fullName > b.fullName) {
                        return 1
                    }
                    if (a.fullName < b.fullName) {
                        return -1
                    }
                    return 0
                })
            } else {
                this.products.sort((a, b) => b.price - a.price)
            }

        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                this.products = products

                if (this.sortByName) {
                    this.products.sort((a, b) => {
                        if (a.fullName > b.fullName) {
                            return 1
                        }
                        if (a.fullName < b.fullName) {
                            return -1
                        }
                        return 0
                    })
                } else {
                    this.products.sort((a, b) => b.price - a.price)
                }
            })
        }
    }

    onChangePriceList() {
        ProductsService.setPrices(this.products, this.priceListId, this.setting, this.office)
        ProductsService.setPrices(this.favorites, this.priceListId, this.setting, this.office)
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.eventsService.setEventItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length || product.productIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            }

            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data
            })

        } else {
            this.eventsService.addEventItem(product)
        }
    }
}
