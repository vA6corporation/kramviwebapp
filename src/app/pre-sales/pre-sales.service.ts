import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { PreSaleModel } from './pre-sale.model';

@Injectable({
  providedIn: 'root'
})
export class PreSalesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private preSale: PreSaleModel|null = null

  setPreSale(preSale: PreSaleModel) { this.preSale = preSale }
  getPreSale(): PreSaleModel|null { return this.preSale }

  getPreSales(): Observable<PreSaleModel[]> {
    return this.httpService.get('preSales')
  }

  create(
    preSale: any,
    preSaleItems: any[],
  ): Observable<PreSaleModel> {
    return this.httpService.post('preSales', { preSale, preSaleItems })
  }

  update(
    preSale: any,
    preSaleItems: any[],
    preSaleId: string,
  ): Observable<void> {
    return this.httpService.put(`preSales/${preSaleId}`, { preSale, preSaleItems })
  }

  delete(preSaleId: string): Observable<void> {
    return this.httpService.delete(`preSales/${preSaleId}`)
  }

}
