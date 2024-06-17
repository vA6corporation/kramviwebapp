import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateSaleItemModel } from '../create-sale-item.model';
import { DialogSaleItemsComponent } from '../dialog-sale-items/dialog-sale-items.component';
import { SalesService } from '../sales.service';
import { IgvType } from '../../products/igv-type.enum';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-sale-items',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './sale-items.component.html',
    styleUrls: ['./sale-items.component.sass']
})
export class SaleItemsComponent implements OnInit {

    constructor(
        private readonly salesService: SalesService,
        private readonly matDialog: MatDialog,
    ) { }

    saleItems: CreateSaleItemModel[] = []
    charge: number = 0
    igvType = IgvType

    private handleSaleItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSaleItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
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
