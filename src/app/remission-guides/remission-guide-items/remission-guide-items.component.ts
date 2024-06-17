import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogRemissionGuideItemsComponent } from '../dialog-remission-guide-items/dialog-remission-guide-items.component';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuidesService } from '../remission-guides.service';

@Component({
    selector: 'app-remission-guide-items',
    templateUrl: './remission-guide-items.component.html',
    styleUrls: ['./remission-guide-items.component.sass']
})
export class RemissionGuideItemsComponent implements OnInit {

    constructor(
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly matDialog: MatDialog,
    ) { }

    remissionGuideItems: RemissionGuideItemModel[] = [];
    private handleRemissionGuideItems$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleRemissionGuideItems$.unsubscribe();
    }

    ngOnInit(): void {
        this.handleRemissionGuideItems$ = this.remissionGuidesService.handleRemissionGuideItems().subscribe(remissionGuideItems => {
            this.remissionGuideItems = remissionGuideItems;
        });
    }

    onSelectRemissionGuideItem(index: number) {
        this.matDialog.open(DialogRemissionGuideItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        });
    }
}
