import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateMoveItemModel } from '../create-move-item.model';
import { DialogMoveItemsComponent } from '../dialog-move-items/dialog-move-items.component';
import { MovesService } from '../moves.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-move-items',
    imports: [MaterialModule],
    templateUrl: './move-items.component.html',
    styleUrls: ['./move-items.component.sass'],
})
export class MoveItemsComponent {

    constructor(
        private readonly movesService: MovesService,
        private readonly matDialog: MatDialog
    ) { }

    moveItems: CreateMoveItemModel[] = []

    private handleMoveItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleMoveItems$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleMoveItems$ = this.movesService.handleMoveItems().subscribe(moveItems => {
            this.moveItems = moveItems
        })
    }

    onClickMoveItem(index: number) {
        this.matDialog.open(DialogMoveItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
