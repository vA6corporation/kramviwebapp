import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CategorySupplyModel } from './category-supply.model';

@Injectable({
    providedIn: 'root'
})
export class CategorySuppliesService {

    constructor(
        private readonly httpService: HttpService
    ) { }

    private categorySupplies$: BehaviorSubject<CategorySupplyModel[]> | null = null;

    getCategorySuppliesByPage(pageIndex: number, pageSize: number) {
        return this.httpService.get(`categorySupplies/byPage/${pageIndex}/${pageSize}`);
    }

    handleCategorySupplies(): Observable<CategorySupplyModel[]> {
        if (this.categorySupplies$ === null) {
            this.categorySupplies$ = new BehaviorSubject<CategorySupplyModel[]>([]);
            this.loadCategorySupplies();
        }
        return this.categorySupplies$.asObservable();
    }

    loadCategorySupplies(): void {
        this.httpService.get('categorySupplies').subscribe(categorySupplies => {
            if (this.categorySupplies$) {
                this.categorySupplies$.next(categorySupplies);
            }
        });
    }

    getCategorySupplyById(categorySupplyId: string): Observable<CategorySupplyModel> {
        return this.httpService.get(`categorySupplies/byId/${categorySupplyId}`);
    }

    create(name: string): Observable<CategorySupplyModel> {
        return this.httpService.post('categorySupplies', { name });
    }

    update(categorySupplyId: string, name: string): Observable<void> {
        return this.httpService.put(`categorySupplies/${categorySupplyId}`, { name });
    }

    delete(categoryId: string): Observable<void> {
        return this.httpService.delete(`categorySupplies/${categoryId}`);
    }

}
