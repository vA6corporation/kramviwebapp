import { Routes } from '@angular/router';
import { CreateRoomsComponent } from './create-rooms/create-rooms.component';
import { EditRoomsComponent } from './edit-rooms/edit-rooms.component';
import { RoomsComponent } from './rooms/rooms.component';

export const routes: Routes = [
    { path: '', component: RoomsComponent },
    { path: 'create', component: CreateRoomsComponent },
    { path: ':roomId/edit', component: EditRoomsComponent }
];
