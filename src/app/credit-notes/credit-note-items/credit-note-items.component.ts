import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model'
import { CreditNotesService } from '../credit-notes.service'
import { DialogCreditNoteItemsComponent } from '../dialog-credit-note-items/dialog-credit-note-items.component'
import { IgvCode } from '../../sales/igv-code.enum'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-credit-note-items',
    imports: [MaterialModule],
    templateUrl: './credit-note-items.component.html',
    styleUrls: ['./credit-note-items.component.sass']
})
export class CreditNoteItemsComponent {

    private readonly creditNotesService = inject(CreditNotesService)
    private readonly matDialog = inject(MatDialog)

    $creditNoteItems = signal<CreateCreditNoteItemModel[]>([])
    $charge = signal<number>(0)
    $countProducts = signal<number>(0)
    igvCode = IgvCode

    private handleCreditNoteItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCreditNoteItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleCreditNoteItems$ = this.creditNotesService.handleCreditNoteItems().subscribe(creditNoteItems => {
            this.$creditNoteItems.set(creditNoteItems)
            this.$charge.set(0)
            this.$countProducts.set(0)
            let charge = 0
            let countProducts = 0
            for (const creditNoteItem of creditNoteItems) {
                countProducts += creditNoteItem.quantity
                if (creditNoteItem.igvCode !== IgvCode.BONIFICACION) {
                    charge += creditNoteItem.price * creditNoteItem.quantity
                }
            }
            this.$charge.set(charge)
            this.$countProducts.set(countProducts)
        })
    }

    onSelectCreditNoteItem(index: number) {
        this.matDialog.open(DialogCreditNoteItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
