import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { ProductItemModel } from '../product-item.model'
import { BillsService } from '../bills.service'
import { ProductsService, UnitCodeModel } from '../../products/products.service'

@Component({
    selector: 'app-dialog-edit-product',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-product.component.html',
    styleUrls: ['./dialog-edit-product.component.sass']
})
export class DialogEditProductComponent {

    private readonly index = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly billsService = inject(BillsService)
    private readonly productsService = inject(ProductsService)
    private readonly dialogRef: MatDialogRef<DialogEditProductComponent> = inject(MatDialogRef)

    productItem: ProductItemModel = this.billsService.getProductItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        fullName: [this.productItem.fullName, Validators.required],
        price: [this.productItem.price, Validators.required],
        quantity: [this.productItem.quantity, Validators.required],
        unitCode: this.productItem.unitCode,
        igvCode: this.productItem.igvCode,
    })
    unitCodes: UnitCodeModel[] = []

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.unitCodes = this.productsService.getUnitCodes()
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const productItem: ProductItemModel = this.formGroup.value
            this.billsService.updateProductItem(productItem, this.index)
            this.dialogRef.close()
        }
    }

    onDelete(): void {
        this.billsService.removeProductItem(this.index)
    }

}
