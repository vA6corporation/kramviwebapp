import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ActivityModel } from './activity.model';

@Injectable({
    providedIn: 'root'
})
export class ActivitiesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getActivities(): Observable<ActivityModel[]> {
        return this.httpService.get('activities')
    }

    getActivityById(activityId: string): Observable<ActivityModel> {
        return this.httpService.get(`activities/byId/${activityId}`)
    }

    create(activity: any): Observable<ActivityModel> {
        return this.httpService.post('activities', { activity })
    }

    update(activity: any, activityId: string): Observable<void> {
        return this.httpService.put(`activities/${activityId}`, { activity })
    }

}
