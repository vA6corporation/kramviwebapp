import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SalesService } from '../sales.service'
import { MaterialModule } from '../../material.module'
import { ReactiveFormsModule } from '@angular/forms'
import { OfficeModel } from '../../offices/office.model'
import { AuthService } from '../../auth/auth.service'
import { Subscription } from 'rxjs'
import { IgvCode } from '../../sales/igv-code.enum'
import { CommonModule } from '@angular/common'
import { SaleItemModel } from '../sale-item.model'

@Component({
    selector: 'app-dialog-detail-sale-items',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-detail-sale-items.component.html',
    styleUrl: './dialog-detail-sale-items.component.sass'
})
export class DialogDetailSaleItemsComponent {

    private readonly saleItemIds: number[] = inject(MAT_DIALOG_DATA)
    private readonly salesService = inject(SalesService)
    private readonly authService = inject(AuthService)

    igvCode = IgvCode
    office: OfficeModel = new OfficeModel()
    $saleItems = signal<SaleItemModel[]>([])

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        });

        this.salesService.getSaleItemDetails(this.saleItemIds).subscribe(saleItems => {
            this.$saleItems.set(saleItems)
        })
    }

}
