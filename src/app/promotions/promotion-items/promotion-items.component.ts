import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PromotionItemModel } from '../promotion-item.model';
import { PromotionsService } from '../promotions.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-promotion-items',
    imports: [MaterialModule, ],
    templateUrl: './promotion-items.component.html',
    styleUrls: ['./promotion-items.component.sass'],
})
export class PromotionItemsComponent {

    constructor(
        private readonly promotionsService: PromotionsService,
        private readonly matDialog: MatDialog,
    ) { }

    promotionItems: PromotionItemModel[] = [];
    charge: number = 0;

    private handlePromotionItems$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handlePromotionItems$.unsubscribe();
    }

    onClickSaleItem(index: number) {
        // this.matDialog.open(DialogSaleItemsComponent, {
        //   width: '600px',
        //   position: { top: '20px' },
        //   data: index,
        // });
    }
}
