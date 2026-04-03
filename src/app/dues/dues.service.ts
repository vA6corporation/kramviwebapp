import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'

@Injectable({
    providedIn: 'root'
})
export class DuesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    update(dues: any[], saleId: any): Observable<void> {
        return this.httpService.put(`dues/${saleId}`, { dues })
    }

}
