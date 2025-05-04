import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProviderModel } from './provider.model';

@Injectable({
    providedIn: 'root'
})
export class ProvidersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private providers$: BehaviorSubject<ProviderModel[]> | null = null

    handleProviders(): Observable<ProviderModel[]> {
        if (this.providers$ === null) {
            this.providers$ = new BehaviorSubject<ProviderModel[]>([])
            this.loadProviders()
        }
        return this.providers$.asObservable()
    }

    loadProviders(): void {
        this.httpService.get('providers').subscribe(providers => {
            if (this.providers$) {
                this.providers$.next(providers)
            }
        })
    }

    getProvidersByKey(key: string): Observable<ProviderModel[]> {
        return this.httpService.get(`providers/byKey/${key}`)
    }

    getProvidersByProduct(productId: string) {
        return this.httpService.get(`providers/byProduct/${productId}`)
    }

    getProvidersByRuc(key: string): Observable<ProviderModel[]> {
        return this.httpService.get(`providers/byRuc/${key}`)
    }

    getProvidersByDni(key: string): Observable<ProviderModel[]> {
        return this.httpService.get(`providers/byDni/${key}`)
    }

    getProvidersByMobile(key: string): Observable<ProviderModel[]> {
        return this.httpService.get(`providers/byMobile/${key}`)
    }

    getProvidersByPage(pageIndex: number, pageSize: number): Observable<ProviderModel[]> {
        return this.httpService.get(`providers/byPage/${pageIndex}/${pageSize}`)
    }

    getCountProviders(): Observable<number> {
        return this.httpService.get('providers/countProviders')
    }

    getProviderById(providerId: string): Observable<ProviderModel> {
        return this.httpService.get(`providers/byId/${providerId}`)
    }

    update(
        provider: ProviderModel,
        providerId: string
    ): Observable<void> {
        return this.httpService.put(`providers/${providerId}`, { provider })
    }

    create(
        provider: ProviderModel,
    ): Observable<ProviderModel> {
        return this.httpService.post('providers', { provider })
    }

    delete(providerId: string) {
        return this.httpService.delete(`providers/${providerId}`)
    }
}
