import { Routes } from '@angular/router';
import { CreateProductsComponent } from './create-products/create-products.component';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { IndexProductsComponent } from './index-products/index-products.component';

export const routes: Routes = [
    { path: '', component: IndexProductsComponent },
    { path: 'create', component: CreateProductsComponent },
    { path: ':productId/edit', component: EditProductsComponent },
];
