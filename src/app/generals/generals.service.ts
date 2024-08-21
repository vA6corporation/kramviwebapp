import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { GeneralModel } from './general.model';

@Injectable({
    providedIn: 'root'
})
export class GeneralsService {

    constructor(
        private readonly httpService: HttpService
    ) { }

    getGeneralById(generalId: string): Observable<GeneralModel> {
        return this.httpService.get(`generals/byId/${generalId}`)
    }

    getGeneralsByPage(
        pageIndex: number,
        pageSize: number
    ): Observable<GeneralModel[]> {
        return this.httpService.get(`generals/byPage/${pageIndex}/${pageSize}`)
    }

    getGeneralsByKey(
        key: string,
    ): Observable<GeneralModel[]> {
        return this.httpService.get(`generals/byKey/${key}`)
    }

    create(general: any): Observable<GeneralModel> {
        return this.httpService.post('generals', { general })
    }

    update(general: any, generalId: string): Observable<void> {
        return this.httpService.put(`generals/${generalId}`, { general })
    }

}
