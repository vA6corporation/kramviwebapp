import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ExpenseModel } from './expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getExpensesByTurn(turnId: string): Observable<any[]> {
    return this.httpService.get(`expenses/byTurn/${turnId}`);
  }

  getExpensesByPage(pageIndex: number, pageSize: number): Observable<{ expenses: any[], count: number }> {
    return this.httpService.get(`expenses/byPage/${pageIndex}/${pageSize}`);
  }

  getExpensesByRangeDate(startDate: Date, endDate: Date): Observable<ExpenseModel[]> {
    return this.httpService.get(`expenses/byRangeDate/${startDate}/${endDate}`);
  }

  getCountExpensesByRangeDate(startDate: Date, endDate: Date): Observable<number> {
    return this.httpService.get(`expenses/countExpensesByRangeDate/${startDate}/${endDate}`);
  }

  getExpensesByRangeDatePage(startDate: Date, endDate: Date, pageIndex: number, pageSize: number): Observable<ExpenseModel[]> {
    return this.httpService.get(`expenses/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`);
  }

  getExpensesByYearOffice(year: number, officeId: string): Observable<number[]> {
    return this.httpService.get(`expensesByYearOffice/${year}/${officeId}`);
  }

  create(expense: ExpenseModel): Observable<ExpenseModel> {
    return this.httpService.post('expenses', { expense });
  }

  update(expense: any, expenseId: string): Observable<void> {
    return this.httpService.put(`expenses/${expenseId}`, { expense });
  }

  delete(expenseId: string) {
    return this.httpService.delete(`expenses/${expenseId}`);
  }
}
