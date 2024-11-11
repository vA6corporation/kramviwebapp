import { Component } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomModel } from '../../rooms/room.model';
import { RoomsService } from '../../rooms/rooms.service';
import { MaterialModule } from '../../material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-pos-rooms',
    standalone: true,
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './pos-rooms.component.html',
    styleUrls: ['./pos-rooms.component.sass']
})
export class PosRoomsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly roomsService: RoomsService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    rooms: RoomModel[] = []

    ngOnInit(): void {
        if (this.authService.isDebtorCancel()) {
            this.router.navigate(['/subscription'])
        }
        
        this.navigationService.setTitle('Recepcion')
        this.roomsService.getRooms().subscribe(rooms => {
            this.rooms = rooms
        })
    }

}
