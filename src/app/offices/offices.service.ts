import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { OfficeModel } from '../offices/office.model'
import { HttpService } from '../http.service'
import { ActivityModel } from '../activities/activity.model'

@Injectable({
    providedIn: 'root'
})
export class OfficesService {

    private readonly httpService = inject(HttpService)

    private offices$: BehaviorSubject<OfficeModel[]> | null = null

    getOffices(): Observable<OfficeModel[]> {
        return this.httpService.get('offices')
    }

    getDeletedOffices(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/deleted')
    }

    handleOfficesByActivity(): Observable<OfficeModel[]> {
        if (this.offices$ === null) {
            this.offices$ = new BehaviorSubject<OfficeModel[]>([])
            this.getOfficesByActivity().subscribe(offices => {
                if (this.offices$) {
                    this.offices$.next(offices)
                }
            })
        }
        return this.offices$.asObservable()
    }

    getOfficesByActivity(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/byActivity')
    }

    getActivities(): Observable<ActivityModel[]> {
        return this.httpService.get('activities')
    }

    getActivitiesByGroup(): Observable<ActivityModel[]> {
        return this.httpService.get('activities/byGroup')
    }

    getOfficeById(officeId: any): Observable<OfficeModel> {
        return this.httpService.get(`offices/byId/${officeId}`)
    }

    getOfficesByGroup(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/byGroup')
    }

    create(office: OfficeModel): Observable<OfficeModel> {
        return this.httpService.post('offices', { office })
    }

    update(office: OfficeModel, officeId: any) {
        return this.httpService.put(`offices/${officeId}`, { office })
    }

    delete(officeId: any): Observable<void> {
        return this.httpService.delete(`offices/${officeId}`)
    }

    restore(officeId: any): Observable<void> {
        return this.httpService.delete(`offices/restore/${officeId}`)
    }

}
