import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  getSummarySalesByDeliveryMonth(month: number) {
    return this.httpService.get(`sales/summarySalesByDeliveryMonth/${month}`);
  }
}
