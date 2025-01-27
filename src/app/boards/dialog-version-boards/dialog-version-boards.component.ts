import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardVersionModel } from '../board-version.model';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-version-boards',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-version-boards.component.html',
    styleUrls: ['./dialog-version-boards.component.sass']
})
export class DialogVersionBoardsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly boardId: string,
        private readonly boardsService: BoardsService,
    ) { }

    board: BoardModel | null = null
    versions: BoardVersionModel[] = []

    ngOnInit(): void {
        this.boardsService.getBoardById(this.boardId).subscribe(board => {
            this.board = board
            this.versions = board.versions.reverse()
        })
    }

}
