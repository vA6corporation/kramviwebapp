import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OfficeModel } from '../auth/office.model';
import { HttpService } from '../http.service';
import { ActivityModel } from '../activities/activity.model';

@Injectable({
    providedIn: 'root'
})
export class OfficesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private offices$: BehaviorSubject<OfficeModel[]> | null = null;

    getOffices(): Observable<OfficeModel[]> {
        return this.httpService.get('offices');
    }

    getDisabledOffices(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/disabled');
    }

    handleOfficesByActivity(): Observable<OfficeModel[]> {
        if (this.offices$ === null) {
            this.offices$ = new BehaviorSubject<OfficeModel[]>([]);
            this.getOfficesByActivity().subscribe(offices => {
                if (this.offices$) {
                    this.offices$.next(offices)
                }
            })
        }
        return this.offices$.asObservable()
    }

    getOfficesByActivity(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/byActivity');
    }

    getActivities(): Observable<ActivityModel[]> {
        return this.httpService.get('activities');
    }

    getActivitiesByGroup(): Observable<ActivityModel[]> {
        return this.httpService.get('activities/byGroup');
    }

    getOfficeById(officeId: string): Observable<OfficeModel> {
        return this.httpService.get(`offices/byId/${officeId}`);
    }

    getOfficesByGroup(): Observable<OfficeModel[]> {
        return this.httpService.get('offices/byGroup');
    }

    create(office: OfficeModel): Observable<OfficeModel> {
        return this.httpService.post('offices', { office });
    }

    update(office: OfficeModel, officeId: string) {
        return this.httpService.put(`offices/${officeId}`, { office });
    }

    delete(officeId: string): Observable<void> {
        return this.httpService.delete(`offices/${officeId}`);
    }

    restore(officeId: string): Observable<void> {
        return this.httpService.delete(`offices/restore/${officeId}`);
    }

}
