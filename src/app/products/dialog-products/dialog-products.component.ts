import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from '../category.model';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-products',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-products.component.html',
    styleUrls: ['./dialog-products.component.sass']
})
export class DialogProductsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly category: CategoryModel,
        private readonly productsService: ProductsService,
    ) { }

    products: ProductModel[] = []

    ngOnInit(): void {
        this.productsService.getProductsByCategoryPage(this.category._id, 1, 500).subscribe(products => {
            this.products = products
        })
    }

}
