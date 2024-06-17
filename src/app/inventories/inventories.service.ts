import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class InventoriesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

}
