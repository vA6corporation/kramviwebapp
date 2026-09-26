import { Component, inject, signal } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { BoardModel } from '../board.model'
import { BoardsService } from '../boards.service'
import { DialogBoardsComponent } from '../dialog-boards/dialog-boards.component'
import { TablesService } from '../../tables/tables.service'
import { NavigationService } from '../../navigation/navigation.service'
import { AuthService } from '../../auth/auth.service'
import { TableModel } from '../../tables/table.model'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-boards',
    imports: [MaterialModule, RouterModule],
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.sass']
})
export class BoardsComponent {

    private readonly matDialog = inject(MatDialog)
    private readonly router = inject(Router)
    private readonly navigationService = inject(NavigationService)
    private readonly boardsService = inject(BoardsService)
    private readonly tablesService = inject(TablesService)
    private readonly authService = inject(AuthService)

    boards: BoardModel[] = []
    $tables = signal<TableModel[]>([])

    private handleClickMenu$: Subscription = new Subscription()
    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleClickMenu$.unsubscribe()
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.navigationService.setMenu([
            { id: 'detail_boards', label: 'Detalles de mesas', icon: 'info', show: false },
        ])

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            this.matDialog.open(DialogBoardsComponent, {
                width: '600px',
                position: { top: '20px' },
            })
        })

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.$tables.set(tables)
            if (tables.length) {
                this.fetchData()
            }
        })

        this.boardsService.setBoardItems([])
        this.navigationService.setTitle('Atencion de cajero')
    }

    fetchData() {
        this.boardsService.getActiveBoards().subscribe(boards => {
            const tables = Array.from(this.$tables())
            for (const table of tables) {
                const foundBoard = boards.find(e => e.tableId === table.id)
                if (foundBoard) {
                    table.board = foundBoard
                } else {
                    table.board = null
                }
            }
            this.$tables.set(tables)
        })
    }
}
