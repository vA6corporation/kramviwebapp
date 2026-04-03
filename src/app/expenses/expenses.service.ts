import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { ExpenseModel } from './expense.model'
import { Params } from '@angular/router'

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getExpensesByTurn(turnId: any): Observable<any[]> {
        return this.httpService.get(`expenses/byTurn/${turnId}`)
    }

    getExpensesByPage(pageIndex: number, pageSize: number, params: Params): Observable<ExpenseModel[]> {
        return this.httpService.get(`expenses/byPage/${pageIndex}/${pageSize}`, params)
    }

    getCountExpenses(params: Params): Observable<number> {
        return this.httpService.get('expenses/countExpenses')
    }

    getExpensesByYearOffice(year: number, officeId: any): Observable<number[]> {
        return this.httpService.get(`expensesByYearOffice/${year}/${officeId}`)
    }

    create(expense: ExpenseModel): Observable<ExpenseModel> {
        return this.httpService.post('expenses', { expense })
    }

    update(expense: any, expenseId: any): Observable<void> {
        return this.httpService.put(`expenses/${expenseId}`, { expense })
    }

    delete(expenseId: any) {
        return this.httpService.delete(`expenses/${expenseId}`)
    }

}
