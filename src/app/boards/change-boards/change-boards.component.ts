import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { TableModel } from '../../tables/table.model';
import { TablesService } from '../../tables/tables.service';
import { BoardsService } from '../boards.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-change-boards',
    imports: [MaterialModule],
    templateUrl: './change-boards.component.html',
    styleUrls: ['./change-boards.component.sass']
})
export class ChangeBoardsComponent {

    constructor(
        private readonly boardsService: BoardsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly tablesService: TablesService,
        private readonly router: Router,
    ) { }

    tables: TableModel[] = []
    private boardId: string = ''
    
    private handleTables$: Subscription = new Subscription()
    
    ngOnDestroy() {
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Seleccione una mesa')
        this.boardId = this.activatedRoute.snapshot.params['boardId']
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
        })
    }

    onChangeBoard(table: TableModel) {
        if (table.board) {
            this.navigationService.showMessage('Esta mesa esta ocupada')
        } else {
            this.navigationService.loadBarStart()
            this.boardsService.changeBoard(this.boardId, table._id).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se ha cambiado la mesa')
                    this.router.navigate(['/boards'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
