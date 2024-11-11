import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoryModel } from '../../products/category.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { CreditNotesService } from '../credit-notes.service';

@Component({
    selector: 'app-edit-credit-note-items',
    templateUrl: './edit-credit-note-items.component.html',
    styleUrls: ['./edit-credit-note-items.component.sass']
})
export class EditCreditNoteItemsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly creditNotesService: CreditNotesService,
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

        const { creditNoteId } = this.activatedRoute.snapshot.params
        this.creditNotesService.getCreditNoteById(creditNoteId).subscribe(creditNote => {
            this.navigationService.setTitle(`Editar nota de credito ${creditNote.invoicePrefix}${this.office.serialPrefix}-${creditNote.invoiceNumber}`)
            const { creditNoteItems } = creditNote
            this.creditNotesService.setCreditNote(creditNote)
            this.creditNotesService.setCreditNoteItems(creditNoteItems)
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
        }
    }

    onSelectProduct(product: ProductModel): void {
        this.creditNotesService.addCreditNoteItem(product)
    }

}
