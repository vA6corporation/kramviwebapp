import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { ProductItemModel } from '../product-item.model'
import { BillsService } from '../bills.service'
import { DialogEditProductComponent } from '../dialog-edit-product/dialog-edit-product.component'
import { MaterialModule } from '../../material.module'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-biller-items',
    imports: [MaterialModule],
    templateUrl: './biller-items.component.html',
    styleUrls: ['./biller-items.component.sass']
})
export class BillerItemsComponent {

    private readonly billsService = inject(BillsService)
    private readonly matDialog = inject(MatDialog)

    $productItems = signal<ProductItemModel[]>([])
    $charge = signal(0)
    $countProducts = signal(0)
    igvCode = IgvCode

    private handleProductItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleProductItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleProductItems$ = this.billsService.handleProductItems().subscribe(productItems => {
            this.$productItems.set(productItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const productItem of productItems) {
                countProducts += productItem.quantity
                if (productItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += productItem.price * productItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectBillItem(index: number) {
        this.matDialog.open(DialogEditProductComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
