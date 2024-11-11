import { Component } from '@angular/core';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService } from '../../products/products.service';
import { MovesService } from '../moves.service';
import { CategoriesService } from '../../products/categories.service';
import { AuthService } from '../../auth/auth.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pos-edit-moves',
    templateUrl: './pos-edit-moves.component.html',
    styleUrls: ['./pos-edit-moves.component.sass']
})
export class PosEditMovesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly movesService: MovesService,
        private readonly categoriesService: CategoriesService,
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
    private moveId: string = ''

    private handleSearch$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleCategories$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleCategories$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar traspaso')
        this.navigationService.showSearch()

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' }
        ])

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories
        })

        this.moveId = this.activatedRoute.snapshot.params['moveId']
        this.navigationService.loadBarStart()
        this.movesService.getMoveById(this.moveId).subscribe(move => {
            this.navigationService.loadBarFinish()
            this.movesService.setMove(move)
            this.movesService.setMoveItems(move.moveItems)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.setting = auth.setting
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe(products => {
                this.navigationService.loadBarFinish()
                this.products = products
                this.selectedIndex = 2
                const foundProduct = products.find(e => e.sku.match(new RegExp(`^${key}$`, 'i')) || e.upc.match(new RegExp(`^${key}$`, 'i')))
                if (foundProduct) {
                    this.onSelectProduct(foundProduct)
                }
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage(error.error.message)
            })
        })

        this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
            this.favorites = products
        })
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.products = []
        if (category.products) {
            this.products = category.products
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                this.products = products
                category.products = products
            })
        }
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.movesService.setMoveItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        this.movesService.addMoveItem(product)
    }


}
