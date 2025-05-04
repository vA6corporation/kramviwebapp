import { Component, Inject } from '@angular/core';
import { SalesService } from '../../sales/sales.service';
import { MaterialModule } from '../../material.module';
import { SaleModel } from '../../sales/sale.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OfficeModel } from '../../auth/office.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-dialog-summary-sale-items',
    imports: [MaterialModule],
    templateUrl: './dialog-summary-sale-items.component.html',
    styleUrl: './dialog-summary-sale-items.component.sass'
})
export class DialogSummarySaleItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly saleIds: string[],
        private readonly salesService: SalesService,
        private readonly authService: AuthService,
    ) { }

    sales: SaleModel[] = []
    office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

        this.salesService.getSalesByIds(this.saleIds).subscribe(sales => {
            this.sales = sales
        })
    }

}
