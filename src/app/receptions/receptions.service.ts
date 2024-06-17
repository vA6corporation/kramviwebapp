import { Injectable } from '@angular/core';
import { CustomerModel } from '../customers/customer.model';
import { HttpService } from '../http.service';
import { RoomModel } from '../rooms/room.model';
import { CreateReceptionModel } from './create-reception.model';
import { ReceptionModel } from './reception.model';

@Injectable({
    providedIn: 'root'
})
export class ReceptionsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private room: RoomModel | null = null
    private reception: ReceptionModel | null = null
    private customers: CustomerModel[] = []

    getRoom() {
        return this.room
    }

    setRoom(room: RoomModel) {
        this.room = room
    }

    getReception() {
        return this.reception
    }

    setReception(reception: ReceptionModel) {
        this.reception = reception
    }

    getCustomers() {
        return this.customers
    }

    setCustomers(customers: CustomerModel[]) {
        this.customers = customers
    }

    checkOut(receptionId: string) {
        return this.httpService.get(`receptions/checkout/${receptionId}`)
    }

    cleaned(receptionId: string) {
        return this.httpService.get(`receptions/cleaned/${receptionId}`)
    }

    update(reception: CreateReceptionModel, customersId: string[], receptionId: string) {
        return this.httpService.put(`receptions/${receptionId}`, { reception, customersId })
    }

    create(reception: CreateReceptionModel, customersId: string[], roomId: string) {
        return this.httpService.post(`receptions/${roomId}`, { reception, customersId })
    }

}
