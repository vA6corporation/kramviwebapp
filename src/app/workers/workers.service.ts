import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpService } from '../http.service';
import { WorkerModel } from './worker.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class WorkersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private workers$: BehaviorSubject<WorkerModel[]> | null = null

    getWorkersByPage(pageIndex: number, pageSize: number) {
        return this.httpService.get(`workers/byPage/${pageIndex}/${pageSize}`)
    }

    getWorkerById(workerId: string): Observable<WorkerModel> {
        return this.httpService.get(`workers/byId/${workerId}`)
    }

    getWorkersCount() {
        return this.httpService.get('workers/count')
    }

    create(worker: WorkerModel): Observable<WorkerModel> {
        return this.httpService.post('workers', { worker })
    }

    update(worker: WorkerModel, workerId: string): Observable<void> {
        return this.httpService.put(`workers/${workerId}`, { worker })
    }

    delete(workerId: string): Observable<void> {
        return this.httpService.delete(`workers/${workerId}`)
    }

    handleWorkers(): Observable<WorkerModel[]> {
        if (this.workers$ === null) {
            this.workers$ = new BehaviorSubject<WorkerModel[]>([])
            this.loadWorkers()
        }
        return this.workers$.asObservable().pipe(filter(e => e.length > 0))
    }

    loadWorkers() {
        this.httpService.get('workers').subscribe(workers => {
            if (this.workers$) {
                this.workers$.next(workers)
            }
        })
    }

    getSummaryWorkers(startDate: Date, endDate: Date, params: Params): Observable<any[]> {
        return this.httpService.get(`workers/summaryWorkers/${startDate}/${endDate}`, params)
    }

    getSummaryWorkersComplete(startDate: Date, endDate: Date): Observable<any[]> {
        return this.httpService.get(`workers/summaryWorkersComplete/${startDate}/${endDate}`)
    }
}
