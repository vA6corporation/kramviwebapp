import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';
import { CreditNotesService } from '../credit-notes.service';
import { MaterialModule } from '../../material.module';
import { SaleItemsComponent } from '../../sales/sale-items/sale-items.component';

@Component({
    selector: 'app-create-credit-note-items',
    standalone: true,
    imports: [MaterialModule, RouterModule, SaleItemsComponent],
    templateUrl: './create-credit-note-items.component.html',
    styleUrls: ['./create-credit-note-items.component.sass']
})
export class CreateCreditNoteItemsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly creditNotesService: CreditNotesService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    categories: CategoryModel[] = []
    products: ProductModel[] = []
    favorites: ProductModel[] = []
    selectedIndex: number = 0
    gridListCols = 4
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()
    saleId: string = ''
    isLoading: boolean = true
    private sale: SaleModel | null = null

    private handleSearch$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.saleId = this.activatedRoute.snapshot.params['saleId']
        this.salesService.getSaleById(this.saleId).subscribe(sale => {
            this.isLoading = false
            this.sale = sale
            this.salesService.setSale(sale)
            const { saleItems } = this.sale
            this.navigationService.setTitle(`Nueva nota de credito ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`)
            this.salesService.setSaleItems(saleItems)
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.products = products
                    this.selectedIndex = 1
                    const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))
                    if (foundProduct) {
                        this.onSelectProduct(foundProduct)
                    }
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
            this.favorites = products
        })
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.creditNotesService.setCreditNoteItems([])
            this.salesService.setSaleItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        this.salesService.addSaleItem(product)
    }


}
