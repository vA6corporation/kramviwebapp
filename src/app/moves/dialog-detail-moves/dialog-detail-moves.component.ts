import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserModel } from '../../users/user.model';
import { MoveItemModel } from '../move-item.model';
import { MoveModel } from '../move.model';
import { MovesService } from '../moves.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-detail-moves',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './dialog-detail-moves.component.html',
    styleUrls: ['./dialog-detail-moves.component.sass'],
})
export class DialogDetailMovesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly moveId: string,
        private readonly movesService: MovesService,
        private readonly matDialogRef: MatDialogRef<DialogDetailMovesComponent>
    ) { }

    move: MoveModel | null = null
    moveItems: MoveItemModel[] = []
    user: UserModel | null = null
    isLoading: boolean = false

    private handleAuth$: Subscription = new Subscription()

    ngOnInit(): void {
        this.movesService.getMoveById(this.moveId).subscribe(move => {
            this.move = move
            this.moveItems = move.moveItems
            this.user = move.user
        })
    }

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    onDelete() {
        const ok = confirm('Esta seguro de eliminar?...');
        if (ok) {
            this.isLoading = true
            this.matDialogRef.disableClose = true
            this.movesService.delete(this.moveId).subscribe(() => {
                this.matDialogRef.close(true)
            })
        }
    }
}
