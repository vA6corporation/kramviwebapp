import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CarrierModel } from './carrier.model';
import { CreateCarrierModel } from './create-carrier.model';

@Injectable({
  providedIn: 'root'
})
export class CarriersService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getCarrierById(carrierId: string): Observable<CarrierModel> {
    return this.httpService.get(`carriers/byId/${carrierId}`);
  }

  getCarriersCount(): Observable<number> {
    return this.httpService.get('carriers/countCarriers');
  }

  getCarriersByRuc(ruc: string) {
    return this.httpService.get(`carriers/byRuc/${ruc}`);
  }

  getCarriersByDni(dni: string) {
    return this.httpService.get(`carriers/byDni/${dni}`);
  }

  getCarriersByKey(key: string) {
    return this.httpService.get(`carriers/byKey/${key}`);
  }

  getCarriersByPage(pageIndex: number, pageSize: number): Observable<CarrierModel[]> {
    return this.httpService.get(`carriers/byPage/${pageIndex}/${pageSize}`);
  }

  create(carrier: CreateCarrierModel): Observable<CarrierModel> {
    return this.httpService.post('carriers', { carrier });
  }

  update(carrier: CreateCarrierModel, carrierId: string) {
    return this.httpService.put(`carriers/${carrierId}`, { carrier });
  }

}
