import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpService } from '../http.service';
import { CategoryModel } from './category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private categories$: BehaviorSubject<CategoryModel[]> | null = null;

    handleCategories(): Observable<CategoryModel[]> {
        if (this.categories$ === null) {
            this.categories$ = new BehaviorSubject<CategoryModel[]>([]);
            this.loadCategories();
        }
        return this.categories$.asObservable().pipe(filter(e => e.length > 0));
    }

    joinCategories(categoriesId: string[]) {
        return this.httpService.post('categories/join', { categoriesId });
    }

    loadCategories(): void {
        this.httpService.get('categories').subscribe(categories => {
            if (this.categories$) {
                this.categories$.next(categories);
            }
        });
    }

    getCategoriesByPage(pageIndex: number, pageSize: number): Observable<CategoryModel[]> {
        return this.httpService.get(`categories/byPage/${pageIndex}/${pageSize}`)
    }

    getCountCategories(): Observable<number> {
        return this.httpService.get('categories/countCategories')
    }

    create(category: any): Observable<CategoryModel> {
        return this.httpService.post('categories', { category });
    }

    update(category: any, categoryId: string) {
        return this.httpService.put(`categories/${categoryId}`, { category });
    }

    delete(categoryId: string) {
        return this.httpService.delete(`categories/${categoryId}`);
    }

}
