import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreateSaleItemModel } from '../create-sale-item.model'
import { DialogSaleItemsComponent } from '../dialog-sale-items/dialog-sale-items.component'
import { SalesService } from '../sales.service'
import { MaterialModule } from '../../material.module'
import { IgvCode } from '../../products/igv-type.enum'

@Component({
    selector: 'app-sale-items',
    imports: [MaterialModule],
    templateUrl: './sale-items.component.html',
    styleUrls: ['./sale-items.component.sass']
})
export class SaleItemsComponent {

    private readonly salesService = inject(SalesService)
    private readonly matDialog = inject(MatDialog)

    $saleItems = signal<CreateSaleItemModel[]>([])
    $charge = signal(0)
    $countProducts = signal(0)
    igvCode = IgvCode

    private handleSaleItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSaleItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.$saleItems.set(saleItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const saleItem of saleItems) {
                countProducts += saleItem.quantity
                if (saleItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += saleItem.price * saleItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectSaleItem(index: number) {
        this.matDialog.open(DialogSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
