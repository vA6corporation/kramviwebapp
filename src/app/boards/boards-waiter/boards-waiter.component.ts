import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { TableModel } from '../../tables/table.model';
import { TablesService } from '../../tables/tables.service';
import { UserModel } from '../../users/user.model';
import { BoardsService } from '../boards.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-boards-waiter',
    standalone: true,
    imports: [MaterialModule, RouterModule],
    templateUrl: './boards-waiter.component.html',
    styleUrls: ['./boards-waiter.component.sass']
})
export class BoardsWaiterComponent implements OnInit {

    constructor(
        private readonly tablesService: TablesService,
        private readonly boardsService: BoardsService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    tables: TableModel[] = [];
    user: UserModel = new UserModel();

    private handleAuth$: Subscription = new Subscription();
    private handleTables$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
        this.handleTables$.unsubscribe();
    }

    ngOnInit(): void {

        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.tables = tables;
            this.boardsService.getActiveBoards().subscribe(boards => {
                for (const table of this.tables) {
                    const foundBoard = boards.find(e => e.tableId === table._id);
                    if (foundBoard) {
                        table.board = foundBoard;
                    } else {
                        table.board = null;
                    }
                }
            });
        });

        this.boardsService.setBoardItems([]);

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.navigationService.setTitle(`Atencion de mesas - ${auth.user.name}`);
        });
    }

    onLogout() {
        this.router.navigate(['/boards/login']);
    }

}
