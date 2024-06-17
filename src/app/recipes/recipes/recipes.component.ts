import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { buildExcel } from '../../buildExcel';
import { DialogProgressComponent } from '../../navigation/dialog-progress/dialog-progress.component';
import { NavigationService } from '../../navigation/navigation.service';
import { CategoriesService } from '../../products/categories.service';
import { CategoryModel } from '../../products/category.model';
import { ProductModel } from '../../products/product.model';
import { ProductsService } from '../../products/products.service';

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.sass']
})
export class RecipesComponent implements OnInit {

    constructor(
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly categoriesService: CategoriesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        categoryId: '',
    });
    categories: CategoryModel[] = [];
    displayedColumns: string[] = ['name', 'recipes', 'charge', 'actions'];
    dataSource: ProductModel[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    private key: string = '';
    private params: Params = {};

    private handleCategories$: Subscription = new Subscription();
    private handleClickMenu$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleCategories$.unsubscribe();
        this.handleClickMenu$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Recetas');

        this.handleCategories$ = this.categoriesService.handleCategories().subscribe(categories => {
            this.categories = categories;
        });

        this.navigationService.setMenu([
            { id: 'export_excel', label: 'Exportar excel', icon: 'download', show: false },
        ]);

        const { categoryId, pageIndex, pageSize, key } = this.activatedRoute.snapshot.queryParams
        this.pageIndex = Number(pageIndex || 0);
        this.pageSize = Number(pageSize || 10);
        this.key = key || '';
        this.formGroup.patchValue({
            categoryId: categoryId || '',
        });
        Object.assign(this.params, {
            categoryId: categoryId || '',
        });
        this.fetchCount();
        this.fetchData();

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(async id => {
            const chunk = 500;
            const products: ProductModel[] = [];

            const dialogRef = this.matDialog.open(DialogProgressComponent, {
                width: '600px',
                position: { top: '20px' },
                data: this.length / chunk
            });

            for (let index = 0; index < this.length / chunk; index++) {
                const values = await lastValueFrom(this.productsService.getProductsByPageWithRecipes(index + 1, chunk, {}));
                dialogRef.componentInstance.onComplete();
                products.push(...values);
            }
            this.navigationService.loadBarFinish();
            const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
            let body = [];
            body.push([
                'PRODUCTO',
                'INSUMO',
                'CANTIDAD',
                'PRECIO U',
                'VALORACION',
            ]);
            for (const product of products) {
                for (const recipe of product.recipes) {
                    body.push([
                        product.fullName.toUpperCase(),
                        recipe.fullName,
                        recipe.quantity,
                        recipe.cost,
                        recipe.cost * recipe.quantity
                    ]);
                }
            }
            const name = 'RECETAS';
            buildExcel(body, name, wscols, [], []);
        });
    }

    fetchData(): void {
        this.navigationService.loadBarStart();
        this.productsService.getProductsByPageWithRecipes(this.pageIndex + 1, this.pageSize, this.params).subscribe(products => {
            this.navigationService.loadBarFinish();
            for (const product of products) {
                product.chargeRecipe = product.recipes.map(e => e.cost * e.quantity).reduce((a, b) => a + b, 0);
            }
            this.dataSource = products;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    fetchCount() {
        if (this.key) {
            Object.assign(this.params, { key: this.key })
            this.productsService.getCountProductsByKey(this.params).subscribe(count => {
                this.length = count;
            });
        } else {
            this.productsService.getCountProducts(this.params).subscribe(count => {
                this.length = count;
            });
        }
    }

    onCategoryChange() {
        const { categoryId } = this.formGroup.value;
        this.pageIndex = 0;
        this.key = '';
        const queryParams: Params = { categoryId, pageIndex: this.pageIndex, key: null };
        Object.assign(this.params, { categoryId });
        
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
        
        this.fetchData();
        this.fetchCount();
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize };
        
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData();
    }

}
