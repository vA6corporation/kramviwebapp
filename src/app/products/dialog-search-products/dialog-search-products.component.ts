import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-dialog-search-products',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-search-products.component.html',
    styleUrls: ['./dialog-search-products.component.sass']
})
export class DialogSearchProductsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly navigationService: NavigationService,
        private readonly dialgoRef: MatDialogRef<DialogSearchProductsComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        key: [null, Validators.required]
    })
    products: ProductModel[] = []

    onSelectProduct(product: ProductModel) {
        this.dialgoRef.close(product)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const { key } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.productsService.getProductsByKey(key).subscribe({
                next: products => {
                    this.formGroup.patchValue({ key: null })
                    this.navigationService.loadBarFinish()
                    this.products = products
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
