import { Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { CreateCreditNoteItemModel } from '../create-credit-note-item.model'
import { CreditNotesService } from '../credit-notes.service'
import { DialogCreditNoteItemsComponent } from '../dialog-credit-note-items/dialog-credit-note-items.component'
import { IgvCode } from '../../products/igv-type.enum'
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

    igvCode = IgvCode
    creditNoteItems: CreateCreditNoteItemModel[] = []
    charge: number = 0

    private handleCreditNoteItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCreditNoteItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleCreditNoteItems$ = this.creditNotesService.handleCreditNoteItems().subscribe(creditNoteItems => {
            this.creditNoteItems = creditNoteItems
            this.charge = 0
            for (const creditNoteItem of this.creditNoteItems) {
                if (creditNoteItem.igvCode !== IgvCode.BONIFICACION) {
                    this.charge += creditNoteItem.price * creditNoteItem.quantity
                }
            }
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
