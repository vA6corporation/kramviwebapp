import { Component, inject, signal } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { NavigationService } from '../../navigation/navigation.service'
import { TableModel } from '../../tables/table.model'
import { TablesService } from '../../tables/tables.service'
import { UserModel } from '../../users/user.model'
import { BoardsService } from '../boards.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-boards-waiter',
    imports: [MaterialModule, RouterModule],
    templateUrl: './boards-waiter.component.html',
    styleUrls: ['./boards-waiter.component.sass']
})
export class BoardsWaiterComponent {

    private readonly router = inject(Router)
    private readonly tablesService = inject(TablesService)
    private readonly boardsService = inject(BoardsService)
    private readonly navigationService= inject(NavigationService)
    private readonly authService = inject(AuthService)

    $tables = signal<TableModel[]>([])
    user: UserModel = new UserModel()

    private handleAuth$: Subscription = new Subscription()
    private handleTables$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleTables$.unsubscribe()
    }

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }

        this.handleTables$ = this.tablesService.handleTables().subscribe(tables => {
            this.$tables.set(tables)
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
        })

        this.boardsService.setBoardItems([])
        this.navigationService.setTitle('Atencion de mozos')
    }

    onLogout() {
        this.router.navigate(['/boards/login']);
    }

}
