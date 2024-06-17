import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { SettingModel } from '../../auth/setting.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { DialogDetailProductsComponent } from '../../products/dialog-detail-products/dialog-detail-products.component';
import { DialogSelectAnnotationData, DialogSelectAnnotationsComponent } from '../../products/dialog-select-annotations/dialog-select-annotations.component';
import { PriceListModel } from '../../products/price-list.model';
import { PriceType } from '../../products/price-type.enum';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';
import { DialogSaleItemsComponent } from '../../sales/dialog-sale-items/dialog-sale-items.component';
import { SaleModel } from '../../sales/sale.model';
import { SalesService } from '../../sales/sales.service';

@Component({
    selector: 'app-pos-copy',
    templateUrl: './pos-copy.component.html',
    styleUrls: ['./pos-copy.component.sass']
})
export class PosCopyComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly favoritesService: FavoritesService,
        private readonly categoriesService: CategoriesService,
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly activatedRoute: ActivatedRoute
    ) { }

    saleId: string | null = null;
    categories: CategoryModel[] = [];
    products: ProductModel[] = [];
    favorites: ProductModel[] = [];
    priceLists: PriceListModel[] = [];
    priceListId: string | null = null;
    selectedIndex: number = 0;
    gridListCols = 4;
    setting: SettingModel = new SettingModel();
    office: OfficeModel = new OfficeModel();
    private sale: SaleModel | null = null;
    private sortByName: boolean = true;

    private handleSearch$: Subscription = new Subscription();
    private handleCategories$: Subscription = new Subscription();
    private handleFavorites$: Subscription = new Subscription();
    private handleAuth$: Subscription = new Subscription();
    private handlePriceLists$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleSearch$.unsubscribe();
        this.handleCategories$.unsubscribe();
        this.handleFavorites$.unsubscribe();
        this.handleAuth$.unsubscribe();
        this.handlePriceLists$.unsubscribe();
    }

    ngOnInit(): void {
        this.saleId = this.activatedRoute.snapshot.params['saleId'];
        this.salesService.getSaleById(this.saleId || '').subscribe(sale => {
            this.sale = sale;
            this.salesService.setSale(sale);
            this.navigationService.setTitle(`Copiar venta ${sale.invoicePrefix}${this.office.serialPrefix}-${sale.invoiceNumber}`);
            this.salesService.setSaleItems(this.sale.saleItems);
        });

        this.navigationService.setMenu([
            { id: 'sort', icon: 'sort_by_alpha', show: true, label: '' },
            { id: 'search', icon: 'search', show: true, label: '' }
        ]);

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories;
        });

        this.handlePriceLists$ = this.productsService.handlePriceLists().subscribe(priceLists => {
            this.priceLists = priceLists;
            this.priceListId = this.setting.defaultPriceListId || this.priceLists[0]?._id;
        });

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting;
            this.office = auth.office;

            this.handleFavorites$ = this.favoritesService.handleFavorites().subscribe(products => {
                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.favorites = products;
                        break;
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null);
                            product.price = price ? price.price : product.price;
                        }
                        this.favorites = products;
                        break;
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId);
                            product.price = price ? price.price : product.price;
                        }
                        this.favorites = products;
                        break;
                }
            });
        });

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart();
            this.productsService.getProductsByKey(key).subscribe(products => {
                this.navigationService.loadBarFinish();

                this.selectedIndex = 2;

                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.products = products;
                        break;
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null);
                            product.price = price ? price.price : product.price;
                        }
                        this.products = products;
                        break;
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId);
                            product.price = price ? price.price : product.price;
                        }
                        this.products = products;
                        break;
                }
            }, (error: HttpErrorResponse) => {
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage(error.error.message);
            });
        });
    }

    onSelectCategory(category: CategoryModel) {
        this.selectedIndex = 2;
        this.products = [];
        if (category.products) {
            const products = category.products

            switch (this.setting.defaultPrice) {
                case PriceType.GLOBAL:
                    this.products = products;
                    break;
                case PriceType.OFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null);
                        product.price = price ? price.price : product.price;
                    }
                    this.products = products;
                    break;
                case PriceType.LISTA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId);
                        product.price = price ? price.price : product.price;
                    }
                    this.products = products;
                    break;
                case PriceType.LISTAOFICINA:
                    for (const product of products) {
                        const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id);
                        product.price = price ? price.price : product.price;
                    }
                    this.products = products;
                    break;
            }

            if (this.sortByName) {
                this.products.sort((a, b) => {
                    if (a.fullName > b.fullName) {
                        return 1;
                    }
                    if (a.fullName < b.fullName) {
                        return -1;
                    }
                    return 0;
                });
            } else {
                this.products.sort((a, b) => b.price - a.price);
            }

        } else {
            this.navigationService.loadBarStart();
            this.productsService.getProductsByCategoryPage(category._id, 1, 500).subscribe(products => {
                this.navigationService.loadBarFinish();
                category.products = products

                switch (this.setting.defaultPrice) {
                    case PriceType.GLOBAL:
                        this.products = products;
                        break;
                    case PriceType.OFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null);
                            product.price = price ? price.price : product.price;
                        }
                        this.products = products;
                        break;
                    case PriceType.LISTA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId);
                            product.price = price ? price.price : product.price;
                        }
                        this.products = products;
                        break;
                    case PriceType.LISTAOFICINA:
                        for (const product of products) {
                            const price = product.prices.find(e => e.priceListId === this.priceListId && e.officeId === this.office._id);
                            product.price = price ? price.price : product.price;
                        }
                        this.products = products;
                        break;
                }

                if (this.sortByName) {
                    this.products.sort((a, b) => {
                        if (a.fullName > b.fullName) {
                            return 1;
                        }
                        if (a.fullName < b.fullName) {
                            return -1;
                        }
                        return 0;
                    });
                } else {
                    this.products.sort((a, b) => b.price - a.price);
                }
            });
        }
    }

    onRightClick(product: ProductModel) {
        this.matDialog.open(DialogDetailProductsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: product,
        });
        return false;
    }

    urlImage(product: ProductModel) {
        const styleObject: any = {}
        if (product.urlImage) {
            styleObject['background-image'] = `url(${decodeURIComponent(product.urlImage)})`
            styleObject['background-size'] = 'cover'
            styleObject['background-position'] = 'center'
        } else {
            if (product.isTrackStock && product.stock < 1) {
                styleObject['background'] = '#ffa7a6' 
            }
        }
        return styleObject
    }

    onChangePriceList() {
        const products = this.products;
        switch (this.setting.defaultPrice) {
            case PriceType.GLOBAL:
                this.products = products;
                break;
            case PriceType.OFICINA:
                for (const product of products) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId == null);
                    product.price = price ? price.price : product.price;
                }
                this.products = products;
                break;
            case PriceType.LISTA:
                for (const product of products) {
                    const price = product.prices.find(e => e.priceListId === this.priceListId);
                    product.price = price ? price.price : product.price;
                }
                this.products = products;
                break;
        }
    }

    onCancel() {
        const ok = confirm('Esta seguro de cancelar?...');
        if (ok) {
            this.salesService.setSaleItems([]);
        }
    }

    onSelectProduct(product: ProductModel, event?: MouseEvent): void {
        if (product.annotations.length || product.linkProductIds.length) {
            const data: DialogSelectAnnotationData = {
                product,
                priceListId: this.priceListId || '',
            };

            const dialogRef = this.matDialog.open(DialogSelectAnnotationsComponent, {
                width: '600px',
                position: { top: '20px' },
                data,
            });

        } else {
            const index = this.salesService.addSaleItem(product);

            if (event && event.ctrlKey) {
                this.matDialog.open(DialogSaleItemsComponent, {
                    width: '600px',
                    position: { top: '20px' },
                    data: index,
                });
            }
        }
    }

}