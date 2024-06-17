import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { RoomModel } from './room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getRooms(): Observable<RoomModel[]> {
    return this.httpService.get('rooms');
  }

  getCountRooms(): Observable<number> {
    return this.httpService.get('rooms/countRooms');
  }

  getRoomById(roomId: string): Observable<RoomModel> {
    return this.httpService.get(`rooms/byId/${roomId}`);
  }

  getRoomsByPage(pageIndex: number, pageSize: number): Observable<RoomModel[]> {
    return this.httpService.get(`rooms/byPage/${pageIndex}/${pageSize}`);
  }

  create(room: any): Observable<RoomModel> {
    return this.httpService.post('rooms', { room });
  }

  update(room: any, roomId: string) {
    return this.httpService.put(`rooms/${roomId}`, { room });
  }

}
