import { Component } from '@angular/core';
import { BoardsService } from '../boards.service';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TablesService } from '../../tables/tables.service';
import { TableModel } from '../../tables/table.model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { BoardItemModel } from '../board-item.model';
import { BoardModel } from '../board.model';

@Component({
    selector: 'app-split-boards',
    imports: [MaterialModule],
    templateUrl: './split-boards.component.html',
    styleUrl: './split-boards.component.sass'
})
export class SplitBoardsComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly tablesService: TablesService,
        private readonly router: Router,
    ) { }

    tables: TableModel[] = []
    board: BoardModel | null = null
    boardItems: BoardItemModel[] = []
    preBoardItems: BoardItemModel[] = []
    selectedIndex: number = 0
    isLoading: boolean = false
    table: null | TableModel = null

    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.boardsService.getActiveBoards().subscribe(boards => {
                for (const table of tables) {
                    const foundBoard = boards.find(e => e.tableId === table._id)
                    if (foundBoard) {
                        table.board = foundBoard
                    } else {
                        table.board = null
                    }
                }
                this.tables = tables
            })

            const tableIndex = this.activatedRoute.snapshot.params['tableIndex']
            this.table = tables[tableIndex]
            if (this.table) {
                this.navigationService.setTitle('Dividir mesa ' + this.table.name)
                this.boardsService.setBoard(null)
                this.navigationService.loadBarStart()
                this.boardsService.getActiveBoardByTable(this.table._id).subscribe({
                    next: board => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        this.board = board
                        this.boardsService.setBoard(board)
                        this.boardItems = board.boardItems
                        this.preBoardItems = JSON.parse(JSON.stringify(this.boardItems))                        
                        this.boardItems.forEach(e => {
                            e.preQuantity = e.quantity
                            e.quantity = 0
                        })
                    }, error: (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.navigationService.loadBarFinish()
                        console.log(error.error.message)
                    }
                })
            } else {
                this.router.navigate(['/boards'])
            }
        })
    }

    onContinue() {
        this.selectedIndex = 1
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

    onChangeSelected(tabIndex: number) {
        this.selectedIndex = tabIndex
    }

    onSplitBoard(table: TableModel) {
        if (table.board) {
            this.navigationService.showMessage('Esta mesa esta ocupada')
        } else {
            this.navigationService.loadBarStart()
            if (this.board) {
                this.boardsService.splitBoard(this.boardItems, this.preBoardItems, this.board._id, table._id).subscribe({
                    next: () => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage('Se ha dividido la mesa')
                        this.router.navigate(['/boards'])
                    }, error: (error: HttpErrorResponse) => {
                        this.navigationService.loadBarFinish()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
            }
        }
    }

}
