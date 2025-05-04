import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardsService } from '../../boards/boards.service';
import { MaterialModule } from '../../material.module';
import { ProductModel } from '../product.model';
import { SalesService } from '../../sales/sales.service';
import { ProductsService } from '../products.service';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';

export interface DialogSelectAnnotationData {
    product: ProductModel,
    priceListId: string
}

@Component({
    selector: 'app-dialog-select-annotations',
    imports: [MaterialModule],
    templateUrl: './dialog-select-annotations.component.html',
    styleUrls: ['./dialog-select-annotations.component.sass']
})
export class DialogSelectAnnotationsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogSelectAnnotationData,
        private readonly dialogRef: MatDialogRef<DialogSelectAnnotationsComponent>,
        private readonly boardsService: BoardsService,
        private readonly productsService: ProductsService,
        private readonly authService: AuthService,
        private readonly salesService: SalesService,
    ) { }

    annotations: string[] = []
    selectedAnnotations: string[] = []
    products: ProductModel[] = []
    selectedProducts: ProductModel[] = []
    setting: SettingModel = new SettingModel()
    office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.annotations = Array.from(this.data.product.annotations)

        if (this.data.product.productIds.length) {
            const foundProducts = this.productsService.getCacheLinkProducts(this.data.product._id)
            if (foundProducts) {
                this.products = foundProducts
            } else {
                this.productsService.getLinkProducts(this.data.product._id).subscribe(products => {
                    this.productsService.setCacheLinkProducts(this.data.product._id, products)
                    this.products = products
                })
            }
        }

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })
    }

    onSelectAnnotation(annotation: string) {
        const index = this.selectedAnnotations.indexOf(annotation)
        if (index > -1) {
            this.selectedAnnotations.splice(index, 1)
        } else {
            this.selectedAnnotations.push(annotation)
        }
    }

    onSelectProduct(product: ProductModel) {
        const findIndex = this.selectedProducts.findIndex(e => e._id === product._id)
        if (findIndex < 0) {
            this.selectedProducts.push(product)
        } else {
            this.selectedProducts.splice(findIndex, 1)
        }
    }

    isSelectedProduct(product: ProductModel) {
        return this.selectedProducts.map(e => e._id).includes(product._id)
    }

    onSubmit() {
        ProductsService.setPrices(this.products, this.data.priceListId, this.setting, this.office)
        this.salesService.addSaleItem(this.data.product, this.selectedAnnotations.join())
        this.boardsService.addBoardItem(this.data.product, this.selectedAnnotations.join())
        if (this.selectedProducts.length) {
            for (const product of this.selectedProducts) {
                this.salesService.addSaleItem(product)
                this.boardsService.addBoardItem(product)
            }
        }
        this.dialogRef.close()
    }

}
