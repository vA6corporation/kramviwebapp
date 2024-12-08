import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogProformaItemsComponent } from '../dialog-proforma-items/dialog-proforma-items.component';
import { ProformaItemModel } from '../proforma-item.model';
import { ProformasService } from '../proformas.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-proforma-items',
    imports: [MaterialModule],
    templateUrl: './proforma-items.component.html',
    styleUrls: ['./proforma-items.component.sass']
})
export class ProformaItemsComponent {

    constructor(
        private readonly proformasService: ProformasService,
        private readonly matDialog: MatDialog,
    ) { }

    proformaItems: ProformaItemModel[] = []
    charge: number = 0

    private handleProformaItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleProformaItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleProformaItems$ = this.proformasService.handleProformaItems().subscribe(proformaItems => {
            this.proformaItems = proformaItems
            this.charge = 0
            for (const proformaItem of this.proformaItems) {
                if (proformaItem.igvCode !== '11') {
                    this.charge += proformaItem.price * proformaItem.quantity
                }
            }
        })
    }

    onClickSaleItem(index: number) {
        this.matDialog.open(DialogProformaItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
