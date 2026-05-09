import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { DialogProformaItemsComponent } from '../dialog-proforma-items/dialog-proforma-items.component'
import { ProformaItemModel } from '../proforma-item.model'
import { ProformasService } from '../proformas.service'
import { MaterialModule } from '../../material.module'
import { IgvCode } from '../../sales/igv-code.enum'

@Component({
    selector: 'app-proforma-items',
    imports: [MaterialModule],
    templateUrl: './proforma-items.component.html',
    styleUrls: ['./proforma-items.component.sass']
})
export class ProformaItemsComponent {

    private readonly proformasService = inject(ProformasService)
    private readonly matDialog = inject(MatDialog)

    $proformaItems = signal<ProformaItemModel[]>([])
    $charge = signal<number>(0)
    $countProducts = signal(0)
    igvCode = IgvCode

    private handleProformaItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleProformaItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleProformaItems$ = this.proformasService.handleProformaItems().subscribe(proformaItems => {
            this.$proformaItems.set(proformaItems)
            this.$charge.set(0)
            let charge = 0
            let countProducts = 0
            for (const proformaItem of proformaItems) {
                countProducts += proformaItem.quantity
                if (proformaItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += proformaItem.price * proformaItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectProformaItem(index: number) {
        this.matDialog.open(DialogProformaItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
