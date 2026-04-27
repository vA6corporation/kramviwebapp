import { Component, inject } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { MaterialModule } from '../../material.module'
import { ProductsComponent } from '../products/products.component'
import { DeletedProductsComponent } from '../deleted-products/deleted-products.component'
import { CategoriesComponent } from '../categories/categories.component'

@Component({
    selector: 'app-index-products',
    imports: [MaterialModule, ProductsComponent, DeletedProductsComponent, CategoriesComponent],
    templateUrl: './index-products.component.html',
    styleUrls: ['./index-products.component.sass']
})
export class IndexProductsComponent {

    private readonly router = inject(Router)
    private readonly activatedRoute = inject(ActivatedRoute)

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
