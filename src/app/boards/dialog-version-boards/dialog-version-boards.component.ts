import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { BoardVersionModel } from '../board-version.model'
import { BoardModel } from '../board.model'
import { BoardsService } from '../boards.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-dialog-version-boards',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-version-boards.component.html',
    styleUrls: ['./dialog-version-boards.component.sass']
})
export class DialogVersionBoardsComponent {

    private readonly boardId: any = inject(MAT_DIALOG_DATA)
    private readonly boardsService = inject(BoardsService)

    $board = signal<BoardModel | null>(null)
    $versions = signal<BoardVersionModel[]>([])

    ngOnInit(): void {
        this.boardsService.getBoardById(this.boardId).subscribe(board => {
            this.$board.set(board)
            this.$versions.set(board.versions.reverse())
        })
    }

}
