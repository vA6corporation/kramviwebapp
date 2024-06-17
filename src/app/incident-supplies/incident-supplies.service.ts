import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { IncidentSupplyModel } from './incident-supply.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentSuppliesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getIncidentSupplyById(
    supplyId: string
  ): Observable<IncidentSupplyModel> {
    return this.httpService.get(`incidentSupplies/byId/${supplyId}`);
  }

  getIncidentSupplyItemsByPageSupply(
    pageIndex: number, 
    pageSize: number, 
    supplyId: string
  ) {
    return this.httpService.get(`incidentSupplies/incidentSupplyItemsByPageSupply/${pageIndex}/${pageSize}/${supplyId}`);
  }

  getIncidentSupplyItemsQuantityBySupply(
    supplyId: string
  ) {
    return this.httpService.get(`incidentSupplies/incidentSupplyItemsQuantityBySupply/${supplyId}`);
  }

}
