import { Routes } from '@angular/router'
import { TransfersComponent } from './transfers/transfers.component'
import { CreateTransfersComponent } from './create-transfers/create-transfers.component'

export const routes: Routes = [
    { path: '', component: TransfersComponent },
    { path: 'create', component: CreateTransfersComponent },
    //{ path: ':userId/edit', component: EditUsersComponent },
]
