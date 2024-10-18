import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { PromotionItemModel } from './promotion-item.model';
import { PromotionModel } from './promotion.model';

@Injectable({
    providedIn: 'root'
})
export class PromotionsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private promotion: PromotionModel | null = null
    private saleItems: PromotionItemModel[] = []

    private promotionItems$: Subject<PromotionItemModel[]> = new Subject()
}
