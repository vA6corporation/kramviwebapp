import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BillItemModel } from '../bill-item.model';
import { BillsService } from '../bills.service';
import { DialogEditProductComponent } from '../dialog-edit-product/dialog-edit-product.component';
import { IgvType } from '../../products/igv-type.enum';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-biller-items',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './biller-items.component.html',
    styleUrls: ['./biller-items.component.sass']
})
export class BillerItemsComponent {

    constructor(
        private readonly billsService: BillsService,
        private readonly matDialog: MatDialog,
    ) { }

    igvType = IgvType
    billItems: BillItemModel[] = [];
    charge: number = 0;
    private handleBillItems$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleBillItems$.unsubscribe();
    }

    ngOnInit(): void {
        this.handleBillItems$ = this.billsService.handleBillItems().subscribe(billItems => {
            this.billItems = billItems;
            this.charge = 0;
            for (const billItem of this.billItems) {
                if (billItem.igvCode !== '11') {
                    this.charge += billItem.price * billItem.quantity;
                }
            }
        });
    }

    onSelectBillItem(index: number) {
        this.matDialog.open(DialogEditProductComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        });
    }

}
