import { Component } from '@angular/core';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { TablesService } from '../../tables/tables.service';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-boards',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-boards.component.html',
    styleUrls: ['./dialog-boards.component.sass']
})
export class DialogBoardsComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly tablesService: TablesService,
    ) { }

    boards: BoardModel[] = []
    chargeBoards: number[] = []
    charge: number = 0

    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.boardsService.getBoardsWithDetails().subscribe(boards => {
                this.boards = boards
                this.chargeBoards = []
                for (const board of this.boards) {
                    const foundTable = tables.find(e => e._id === board.tableId)
                    if (foundTable) {
                        board.table = foundTable
                    }
                    const totalCharge = board.boardItems.map(e => e.price * e.quantity).reduce((a, b) => a + b, 0)
                    this.chargeBoards.push(totalCharge)
                    this.charge += totalCharge
                }
            })
        })
    }

}
