import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { SupplyModel } from './supply.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SuppliesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private supplies$: BehaviorSubject<SupplyModel[]> | null = null

    handleSupplies(): Observable<SupplyModel[]> {
        if (this.supplies$ === null) {
            this.supplies$ = new BehaviorSubject<SupplyModel[]>([])
            this.loadSupplies()
        }
        return this.supplies$.asObservable()
    }

    loadSupplies(): void {
        this.httpService.get('supplies').subscribe(supplies => {
            if (this.supplies$) {
                this.supplies$.next(supplies)
            }
        })
    }

    getSupplyById(supplyId: string): Observable<SupplyModel> {
        return this.httpService.get(`supplies/byId/${supplyId}`)
    }

    getSuppliesWithRegister(): Observable<SupplyModel[]> {
        return this.httpService.get('supplies/withRegister')
    }

    getSuppliesByKey(key: string): Observable<SupplyModel[]> {
        return this.httpService.get(`supplies/byKey/${key}`)
    }

    getSuppliesByKeyWithStock(key: string): Observable<SupplyModel[]> {
        return this.httpService.get(`supplies/byKeyWithStock/${key}`)
    }

    getSuppliesWithStockByDate(date: Date): Observable<SupplyModel[]> {
        return this.httpService.get(`supplies/withStockByDate/${date}`)
    }

    getSuppliesByPageWithStock(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<SupplyModel[]> {
        return this.httpService.get(`supplies/byPageWithStock/${pageIndex}/${pageSize}`, params)
    }

    getCountSupplies(params: Params): Observable<number> {
        return this.httpService.get('supplies/countSupplies', params)
    }

    create(supply: SupplyModel) {
        return this.httpService.post('supplies', { supply })
    }

    update(supply: any, supplyId: string) {
        return this.httpService.put(`supplies/${supplyId}`, { supply })
    }

    saveDaily(supplies: any[]) {
        return this.httpService.post('supplies/dailyRegister', { supplies })
    }

    delete(supplyId: string) {
        return this.httpService.delete(`supplies/${supplyId}`)
    }
}
