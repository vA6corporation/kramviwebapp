import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardItemModel } from '../board-item.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dialog-split-boards',
    imports: [MaterialModule],
    templateUrl: './dialog-split-boards.component.html',
    styleUrl: './dialog-split-boards.component.sass'
})
export class DialogSplitBoardsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly boardItems: BoardItemModel[],
        private readonly router: Router
    ) { }

    splitBoardItems: BoardItemModel[] = []

    ngOnInit() {
        this.splitBoardItems = JSON.parse(JSON.stringify(this.boardItems))
        this.splitBoardItems.forEach(e => {
            e.preQuantity = e.quantity
            e.quantity = 0
        })
    }

    onAddBoardItem(boardItem: BoardItemModel) {
        if (boardItem.quantity < boardItem.preQuantity) {
            boardItem.quantity++
        }
    }

    onRemoveBoardItem(boardItem: BoardItemModel) {
        if (boardItem.quantity > 0) {
            boardItem.quantity--
        }
    }

    onSubmit() {
        this.router.navigate(['/boards/splitBoards'])
    }

}
