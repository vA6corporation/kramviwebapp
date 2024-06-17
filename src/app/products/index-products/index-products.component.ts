import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { ProductsComponent } from '../products/products.component';
import { DisabledProductsComponent } from '../disabled-products/disabled-products.component';
import { DeletedProductsComponent } from '../deleted-products/deleted-products.component';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
    selector: 'app-index-products',
    standalone: true,
    imports: [MaterialModule, ProductsComponent, DisabledProductsComponent, DeletedProductsComponent, CategoriesComponent],
    templateUrl: './index-products.component.html',
    styleUrls: ['./index-products.component.sass']
})
export class IndexProductsComponent implements OnInit {

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    selectedIndex: number = 0

    ngOnInit(): void {
        const { tabIndex } = this.activatedRoute.snapshot.queryParams
        this.selectedIndex = tabIndex
    }

    onChangeSelected(tabIndex: number) {
        const queryParams: Params = { tabIndex }
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
    }

}
