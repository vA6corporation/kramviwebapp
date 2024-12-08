import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreateEventItemModel } from './create-event-item.model';
import { CreateEventModel } from './create-event.model';
import { EventItemModel } from './event-item.model';
import { EventModel } from './event.model';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private eventItems$ = new BehaviorSubject<CreateEventItemModel[]>([])
    private eventItems: CreateEventItemModel[] = []
    private event: EventModel | null = null

    setEvent(event: EventModel) {
        this.event = event
    }

    getEvent(): EventModel | null {
        return this.event
    }

    saveEvent(event: CreateEventModel, eventItems: CreateEventItemModel[]) {
        return this.httpService.post('events', { event, eventItems })
    }

    updateEvent(event: CreateEventModel, eventItems: CreateEventItemModel[], eventId: string) {
        return this.httpService.put(`events/${eventId}`, { event, eventItems })
    }

    getEvents(date: Date) {
        return this.httpService.get(`events/byDate/${date}`)
    }

    handleEventItems() {
        return this.eventItems$.asObservable()
    }

    getEventItem(index: number): CreateEventItemModel {
        return this.eventItems[index]
    }

    setEventItems(eventItems: EventItemModel[]) {
        this.eventItems = eventItems.map(e => ({ ...e, prices: [], bachId: null }))
        this.eventItems$.next(this.eventItems)
    }

    addEventItem(product: ProductModel, annotation: string = '') {
        const index = this.eventItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode && e.observations === annotation)
        if (index < 0) {
            const eventItem: CreateEventItemModel = {
                fullName: product.fullName,
                onModel: product.onModel,
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                isTrackStock: product.isTrackStock,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                observations: annotation,
                bachId: null,
                prices: []
            }
            this.eventItems.push(eventItem)
        } else {
            const eventItem: CreateEventItemModel = this.eventItems[index]
            eventItem.quantity += 1
            this.eventItems.splice(index, 1, eventItem)
        }
        this.eventItems$.next(this.eventItems)
    }

    updateEventItem(index: number, eventItem: CreateEventItemModel) {
        this.eventItems.splice(index, 1, eventItem)
        this.eventItems$.next(this.eventItems)
    }

    removeEventItem(index: number) {
        this.eventItems.splice(index, 1)
        this.eventItems$.next(this.eventItems)
    }

    delete(eventId: string) {
        return this.httpService.delete(`events/${eventId}`)
    }

    getEventById(eventId: string): Observable<EventModel> {
        return this.httpService.get(`events/byId/${eventId}`)
    }

    updateDate(date: Date, eventId: string) {
        return this.httpService.put(`events/updateDate/${eventId}`, { date })
    }

}
