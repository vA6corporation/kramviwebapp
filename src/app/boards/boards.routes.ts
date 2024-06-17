import { Routes } from '@angular/router';
import { BoardsWaiterComponent } from './boards-waiter/boards-waiter.component';
import { BoardsComponent } from './boards/boards.component';
import { ChangeBoardsComponent } from './change-boards/change-boards.component';
import { ChargeBoardsComponent } from './charge-boards/charge-boards.component';
import { DeletedBoardsComponent } from './deleted-boards/deleted-boards.component';
import { LoginWaiterComponent } from './login-waiter/login-waiter.component';
import { PosBoardWaiterComponent } from './pos-board-waiter/pos-board-waiter.component';
import { PosBoardComponent } from './pos-board/pos-board.component';

export const routes: Routes = [
    { path: '', component: BoardsComponent },
    { path: 'login', component: LoginWaiterComponent },
    { path: 'deletedBoards', component: DeletedBoardsComponent },
    { path: 'posBoards/:tableIndex', component: PosBoardComponent },
    { path: 'changeBoards/:boardId', component: ChangeBoardsComponent },
    { path: 'chargeBoards', component: ChargeBoardsComponent },
    { path: 'waiter', component: BoardsWaiterComponent },
    { path: 'posBoardsWaiter/:tableIndex', component: PosBoardWaiterComponent },
];