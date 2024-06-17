import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { LotModel } from './lot.model';

@Injectable({
    providedIn: 'root'
})
export class LotsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getActiveLots(): Observable<LotModel[]> {
        return this.httpService.get('lots/active')
    }

    getCountLots(params: Params): Observable<number> {
        return this.httpService.get('lots/countLots', params)
    }

    getLotById(lotId: string): Observable<LotModel> {
        return this.httpService.get(`lots/byId/${lotId}`)
    }

    getLotsByPage(pageIndex: number, pageSize: number, params: Params): Observable<LotModel[]> {
        return this.httpService.get(`lots/byPage/${pageIndex}/${pageSize}`, params)
    }

    create(lot: any): Observable<LotModel> {
        return this.httpService.post('lots', { lot })
    }

    update(lot: any, lotId: string): Observable<void> {
        return this.httpService.put(`lots/${lotId}`, { lot })
    }

    softDelete(lotId: string): Observable<void> {
        return this.httpService.delete(`lots/${lotId}`)
    }

}
