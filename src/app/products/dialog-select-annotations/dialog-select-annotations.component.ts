import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductModel } from '../product.model';
import { ProductsService } from '../products.service';
import { AuthService } from '../../auth/auth.service';
import { SalesService } from '../../sales/sales.service';
import { BoardsService } from '../../boards/boards.service';
import { SettingModel } from '../../auth/setting.model';
import { OfficeModel } from '../../auth/office.model';
import { PriceType } from '../price-type.enum';
import { MaterialModule } from '../../material.module';

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
        private readonly authService: AuthService,
        private readonly productsService: ProductsService,
        private readonly salesService: SalesService,
        private readonly boardsService: BoardsService,
    ) { }

    annotations: string[] = []
    products: ProductModel[] = []
    pickProducts: ProductModel[] = []
    selectedAnnotations: string[] = []
    private setting: SettingModel = new SettingModel()
    private office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.annotations = Array.from(this.data.product.annotations)
        if (this.data.product.linkProductIds.length) {
            this.productsService.getLinkProducts(this.data.product._id).subscribe(products => {
                this.products = products
            })
        }

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.office = auth.office
        })
    }

    onSelect(annotation: string) {
        const index = this.selectedAnnotations.indexOf(annotation)
        if (index > -1) {
            this.selectedAnnotations.splice(index, 1)
        } else {
            this.selectedAnnotations.push(annotation)
        }
    }

    onSelectProduct(product: ProductModel) {
        const findIndex = this.pickProducts.findIndex(e => e._id === product._id)
        if (findIndex < 0) {
            this.pickProducts.push(product)
        } else {
            this.pickProducts.splice(findIndex, 1)
        }
    }

    isPickedProduct(product: ProductModel) {
        return this.pickProducts.map(e => e._id).includes(product._id)
    }

    onSubmit() {
        switch (this.setting.defaultPrice) {
            case PriceType.GLOBAL:
                break
            case PriceType.OFICINA:
                for (const product of this.pickProducts) {
                    const price = product.prices.find(e => e.officeId === this.office._id && e.priceListId === null)
                    product.price = price ? price.price : product.price
                }
                break
            case PriceType.LISTA:
                for (const product of this.pickProducts) {
                    const price = product.prices.find(e => e.priceListId === this.data.priceListId)
                    product.price = price ? price.price : product.price
                }
                break
            case PriceType.LISTAOFICINA:
                for (const product of this.pickProducts) {
                    const price = product.prices.find(e => e.priceListId === this.data.priceListId && e.officeId === this.office._id)
                    product.price = price ? price.price : product.price
                }
                break
        }
        if (this.pickProducts.length === 0) {
            this.salesService.addSaleItem(this.data.product, this.selectedAnnotations.join())
            this.boardsService.addBoardItem(this.data.product, this.selectedAnnotations.join())
        } else {
            this.salesService.forceAddSaleItem(this.data.product, this.selectedAnnotations.join())
            this.boardsService.forceAddBoardItem(this.data.product, this.selectedAnnotations.join())
            if (this.pickProducts.length) {
                for (const product of this.pickProducts) {
                    this.salesService.forceAddSaleItem(product)
                    this.boardsService.forceAddBoardItem(product)
                }
            }
        }
        this.dialogRef.close()
    }

}
