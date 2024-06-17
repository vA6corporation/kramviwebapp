import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { BankModel } from './bank.model';
import { ProviderModel } from './provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getProvidersByKey(key: string): Observable<ProviderModel[]> {
    return this.httpService.get(`providers/byKey/${key}`);
  }

  getProvidersByRuc(key: string): Observable<ProviderModel[]> {
    return this.httpService.get(`providers/byRuc/${key}`);
  }

  getProvidersByDni(key: string): Observable<ProviderModel[]> {
    return this.httpService.get(`providers/byDni/${key}`);
  }

  getProvidersByMobile(key: string): Observable<ProviderModel[]> {
    return this.httpService.get(`providers/byMobile/${key}`);
  }

  getProvidersByPage(pageIndex: number, pageSize: number): Observable<ProviderModel[]> {
    return this.httpService.get(`providers/byPage/${pageIndex}/${pageSize}`);
  }

  getProvidersCount(): Observable<number> {
    return this.httpService.get('providers/count');
  }

  getProviderById(providerId: string): Observable<ProviderModel> {
    return this.httpService.get(`providers/byId/${providerId}`);
  }

  update(provider: ProviderModel, banks: BankModel[], providerId: string): Observable<ProviderModel> {
    return this.httpService.put(`providers/${providerId}`, { provider, banks });
  }

  create(provider: ProviderModel, banks: BankModel[]) {
    console.log(provider);
    
    return this.httpService.post('providers', { provider, banks });
  }
}
