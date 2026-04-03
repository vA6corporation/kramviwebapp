import { Routes } from '@angular/router'
import { BoardsWaiterComponent } from './boards-waiter/boards-waiter.component'
import { BoardsComponent } from './boards/boards.component'
import { ChangeBoardsComponent } from './change-boards/change-boards.component'
import { DeletedBoardsComponent } from './deleted-boards/deleted-boards.component'
import { PosBoardWaiterComponent } from './pos-board-waiter/pos-board-waiter.component'
import { PosBoardComponent } from './pos-board/pos-board.component'
import { SplitBoardsComponent } from './split-boards/split-boards.component'

export const routes: Routes = [
    { path: '', component: BoardsComponent },
    { path: 'deletedBoards', component: DeletedBoardsComponent },
    { path: 'posBoards/:tableIndex', component: PosBoardComponent },
    { path: 'splitBoards/:tableIndex', component: SplitBoardsComponent },
    { path: 'changeBoards/:boardId', component: ChangeBoardsComponent },
    { path: 'waiter', component: BoardsWaiterComponent },
    { path: 'posBoardsWaiter/:tableIndex', component: PosBoardWaiterComponent },
];
