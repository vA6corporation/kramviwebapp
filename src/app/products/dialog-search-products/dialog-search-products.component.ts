import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProductModel } from '../product.model'
import { ProductsService } from '../products.service'
import { MatDialogRef } from '@angular/material/dialog'
import { HttpErrorResponse } from '@angular/common/http'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'
import { AuthService } from '../../auth/auth.service'

@Component({
    selector: 'app-dialog-search-products',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-search-products.component.html',
    styleUrls: ['./dialog-search-products.component.sass']
})
export class DialogSearchProductsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogSearchProductsComponent> = inject(MatDialogRef)
    private readonly authService = inject(AuthService)
    private readonly productsService = inject(ProductsService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        key: [null, Validators.required]
    })
    products: ProductModel[] = []

    onSelectProduct(product: ProductModel) {
        this.dialogRef.close(product)
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
