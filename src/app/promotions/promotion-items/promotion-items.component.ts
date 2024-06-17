import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PromotionItemModel } from '../promotion-item.model';
import { PromotionsService } from '../promotions.service';

@Component({
    selector: 'app-promotion-items',
    templateUrl: './promotion-items.component.html',
    styleUrls: ['./promotion-items.component.sass']
})
export class PromotionItemsComponent implements OnInit {

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

    ngOnInit(): void {
    }

    onClickSaleItem(index: number) {
        // this.matDialog.open(DialogSaleItemsComponent, {
        //   width: '600px',
        //   position: { top: '20px' },
        //   data: index,
        // });
    }
}
