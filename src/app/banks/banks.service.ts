import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { BankModel } from './bank.model';

@Injectable({
    providedIn: 'root'
})
export class BanksService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private banks$: BehaviorSubject<BankModel[]> | null = null

    handleBanks() {
        if (this.banks$ === null) {
            this.banks$ = new BehaviorSubject<BankModel[]>([])
            this.loadBanks()
        }
        return this.banks$.asObservable()
    }

    loadBanks() {
        this.getBanks().subscribe(banks => {
            if (this.banks$) {
                this.banks$.next(banks)
            }
        })
    }

    getBankById(bankId: any): Observable<BankModel> {
        return this.httpService.get(`banks/byId/${bankId}`)
    }

    getBanks(): Observable<BankModel[]> {
        return this.httpService.get('banks')
    }

    getCountBanks(): Observable<number> {
        return this.httpService.get('banks/countBanks')
    }

    create(bank: BankModel): Observable<BankModel> {
        return this.httpService.post('banks', { bank })
    }

    update(bank: BankModel, bankId: any): Observable<void> {
        return this.httpService.put(`banks/${bankId}`, { bank })
    }

    delete(bankId: any): Observable<void> {
        return this.httpService.delete(`banks/${bankId}`)
    }

}
