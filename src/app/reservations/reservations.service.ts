import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getReservationsByRoom(roomId: string): Observable<any[]> {
        return this.httpService.get(`reservations/byRoom/${roomId}`)
    }

    create(reservation: any): Observable<any> {
        return this.httpService.post('reservations', { reservation })
    }

    delete(reservationId: string) {
        return this.httpService.delete(`reservations/${reservationId}`)
    }
    
}
