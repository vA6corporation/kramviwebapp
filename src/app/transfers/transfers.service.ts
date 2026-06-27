import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { TransferModel } from './transfer.model'

@Injectable({
  providedIn: 'root',
})
export class TransfersService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCountTransfers(): Observable<number> {
        return this.httpService.get('transfers/countTransfers')
    }

    getTransfersByPage(
        pageIndex: number,
        pageSize: number,
    ): Observable<TransferModel[]> {
        return this.httpService.get(`transfers/byPage/${pageIndex}/${pageSize}`)
    }

    create(transfer: any, inIncidentItems: any[]): Observable<TransferModel> {
        return this.httpService.post('transfers', { transfer, inIncidentItems })
    }

    delete(transferId: number): Observable<void> {
        return this.httpService.delete(`transfers/${transferId}`)
    }

}
