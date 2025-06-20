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
import { CategoryModel } from '../../products/category.model';
import { PriceListModel } from '../../products/price-list.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformaItemsComponent } from '../proforma-items/proforma-items.component';
import { ProformasService } from '../proformas.service';

@Component({
    selector: 'app-copy-proformas',
    imports: [MaterialModule, RouterModule, ProformaItemsComponent],
    templateUrl: './copy-proformas.component.html',
    styleUrls: ['./copy-proformas.component.sass']
})
export class CopyProformasComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly proformasService: ProformasService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    priceLists: PriceListModel[] = []
    priceListId: string | null = null
    selectedIndex: number = 0
    proformaItems: ProformaItemModel[] = []
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()
    private proformaId: string = ''

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleProformaItems$: Subscription = new Subscription()
    private handlePriceLists$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleProformaItems$.unsubscribe()
        this.handlePriceLists$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        const { proformaId } = this.activatedRoute.snapshot.queryParams
        this.proformaId = proformaId
        this.proformasService.getProformaById(this.proformaId).subscribe(proforma => {
            const { proformaItems } = proforma
            this.proformasService.setProforma(proforma)
            this.proformasService.setProformaItems(proformaItems)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                ProductsService.setPrices(products, this.priceListId, this.setting, this.office)
                this.favorites = products
            })
        })

        this.navigationService.setTitle('Editar proforma')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            { id: 'printer', icon: 'printer', show: false, label: 'Imprimir' }
        ])

        this.handleProformaItems$ = this.proformasService.handleProformaItems().subscribe(proformaItems => {
            this.proformaItems = proformaItems
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

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 1
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

    onChangePriceList() {
        ProductsService.setPrices(this.products, this.priceListId, this.setting, this.office)
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.proformasService.setProformaItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        this.proformasService.addProformaItem(product)
    }

}
