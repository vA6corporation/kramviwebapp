import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { DialogRemissionGuideItemsComponent } from '../dialog-remission-guide-items/dialog-remission-guide-items.component'
import { RemissionGuideItemModel } from '../remission-guide-item.model'
import { RemissionGuidesService } from '../remission-guides.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-remission-guide-items',
    imports: [MaterialModule],
    templateUrl: './remission-guide-items.component.html',
    styleUrls: ['./remission-guide-items.component.sass'],
})
export class RemissionGuideItemsComponent {

    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly matDialog = inject(MatDialog)

    remissionGuideItems: RemissionGuideItemModel[] = []
    private handleRemissionGuideItems$: Subscription = new Subscription()
    $countProducts = signal(0)

    ngOnDestroy() {
        this.handleRemissionGuideItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleRemissionGuideItems$ = this.remissionGuidesService.handleRemissionGuideItems().subscribe(remissionGuideItems => {
            this.remissionGuideItems = remissionGuideItems
            let countProducts = 0
            for (const remissionGuideItem of remissionGuideItems) {
                countProducts += remissionGuideItem.quantity
            }
            this.$countProducts.set(countProducts)
        })
    }

    onSelectRemissionGuideItem(index: number) {
        this.matDialog.open(DialogRemissionGuideItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }
}
