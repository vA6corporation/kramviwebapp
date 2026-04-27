import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { FavoritesService } from '../../favorites/favorites.service'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { CategoryModel } from '../../products/category.model'
import { DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component'
import { PriceListModel } from '../../products/price-list.model'
import { ProductModel } from '../../products/product.model'
import { ProductsService } from '../../products/products.service'
import { DialogLastSalesComponent } from '../../sales/dialog-last-sales/dialog-last-sales.component'
import { RemissionGuideItemModel } from '../remission-guide-item.model'
import { RemissionGuideItemsComponent } from '../remission-guide-items/remission-guide-items.component'
import { RemissionGuidesService } from '../remission-guides.service'

@Component({
    selector: 'app-edit-remission-guides',
    imports: [MaterialModule, RemissionGuideItemsComponent, RouterModule],
    templateUrl: './edit-remission-guides.component.html',
    styleUrls: ['./edit-remission-guides.component.sass'],
})
export class EditRemissionGuidesComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly favoritesService = inject(FavoritesService)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly authService = inject(AuthService)

    $categories = signal<CategoryModel[]>([])
    $products = signal<ProductModel[]>([])
    $favorites = signal<ProductModel[]>([])
    selectedIndex: number = 0
    remissionGuideItems: RemissionGuideItemModel[] = []
    office: OfficeModel = new OfficeModel()
    $isLoading = signal<boolean>(true)

    private handleSearch$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleRemissionGuideItems$: Subscription = new Subscription()
    private handleFavorites$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleRemissionGuideItems$.unsubscribe()
        this.handleFavorites$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        const remissionGuideId = this.activatedRoute.snapshot.params['remissionGuideId']
        this.navigationService.loadBarStart()
        this.remissionGuidesService.getRemissionGuideById(remissionGuideId).subscribe({
            next: remissionGuide => {
                this.$isLoading.set(false)
                this.navigationService.loadBarFinish()
                this.remissionGuidesService.setRemissionGuide(remissionGuide)
                this.remissionGuidesService.setRemissionGuideItems(remissionGuide.remissionGuideItems)
            }, error: (error: HttpErrorResponse) => {
                this.navigationService.loadBarStart()
                this.navigationService.showMessage(error.error.message)
            }
        })

        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setTitle('Editar guia de remision')

        this.navigationService.setMenu([
            { id: 'search', icon: 'search', show: true, label: '' },
            // { id: 'printer', icon: 'printer', show: false, label: 'Imprimir' }
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

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                this.$favorites.set(products)
            })
        })

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.navigationService.loadBarFinish()
                    this.selectedIndex = 2
                    this.$products.set(products)

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

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...')
        if (ok) {
            this.remissionGuidesService.setRemissionGuideItems([])
        }
    }

    onSelectProduct(product: ProductModel): void {
        if (product.annotations.length) {
            this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: product
            })
        } else {
            this.remissionGuidesService.addRemissionGuideItem(product)
        }
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2
        this.$products.set([])
        if (category.products) {
            const products = category.products
            this.$products.set(products)
        } else {
            this.navigationService.loadBarStart()
            this.productsService.getProductsByCategoryPage(category.id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish()
                category.products = products
                this.$products.set(products)
            })
        }
    }

}
