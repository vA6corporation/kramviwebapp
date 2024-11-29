import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class InventorySuppliesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    addStock(purchaseSupply: any, purchaseSupplyItems: any[]) {
        return this.httpService.post('purchaseSupplies', { purchaseSupply, purchaseSupplyItems })
    }

    removeStock(incidentSupply: any, incidentSupplyItems: any[]) {
        return this.httpService.post('incidentSupplies', { incidentSupply, incidentSupplyItems })
    }

    moveStock(moveSupply: any, moveOutSupplyItems: any[]) {
        return this.httpService.post('moveSupplies', { moveSupply, moveOutSupplyItems })
    }

}
