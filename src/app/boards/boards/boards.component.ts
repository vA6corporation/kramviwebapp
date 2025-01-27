import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoardModel } from '../board.model';
import { BoardsService } from '../boards.service';
import { DialogBoardsComponent } from '../dialog-boards/dialog-boards.component';
import { TablesService } from '../../tables/tables.service';
import { NavigationService } from '../../navigation/navigation.service';
import { AuthService } from '../../auth/auth.service';
import { TableModel } from '../../tables/table.model';
import { MaterialModule } from '../../material.module';
import { io } from "socket.io-client";

@Component({
    selector: 'app-boards',
    imports: [MaterialModule, RouterModule],
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.sass']
})
export class BoardsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly boardsService: BoardsService,
        private readonly tablesService: TablesService,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    boards: BoardModel[] = []
    tables: TableModel[] = []
    officeId: string = ''

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        // const socket = io('http://localhost:3000')

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

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.officeId = auth.office._id
            // socket.emit('join', this.officeId)
            // socket.on('changeBoards', () => {
            //     this.fetchData()
            // })
        })

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.tables = tables
            if (this.tables.length) {
                this.fetchData()
            }
        })

        this.boardsService.setBoardItems([])
        this.navigationService.setTitle('Atencion de mesas')
    }

    fetchData() {
        this.boardsService.getActiveBoards().subscribe(boards => {
            for (const table of this.tables) {
                const foundBoard = boards.find(e => e.tableId === table._id)
                if (foundBoard) {
                    table.board = foundBoard
                } else {
                    table.board = null
                }
            }
        })
    }
}
