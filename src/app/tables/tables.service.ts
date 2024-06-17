import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { TableModel } from './table.model';

@Injectable({
    providedIn: 'root'
})
export class TablesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private tables$: BehaviorSubject<TableModel[]> | null = null

    handleTables() {
        if (this.tables$ === null) {
            this.tables$ = new BehaviorSubject<TableModel[]>([])
            this.loadTables()
        }
        return this.tables$.asObservable()
    }

    loadTables() {
        this.httpService.get('tables').subscribe(tables => {
            if (this.tables$) {
                this.tables$.next(tables)
            }
        })
    }

    getTables(): Observable<TableModel[]> {
        return this.httpService.get('tables/all')
    }

    getTableById(tableId: string): Observable<TableModel> {
        return this.httpService.get(`tables/${tableId}`)
    }

    create(table: any): Observable<TableModel> {
        return this.httpService.post('tables', { table })
    }

    update(table: any, tableId: string): Observable<void> {
        return this.httpService.put(`tables/${tableId}`, { table })
    }

}
