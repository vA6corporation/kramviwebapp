import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { ProviderModel } from '../providers/provider.model';
import { PurchaseModel } from '../purchases/purchase.model';
import { SupplyModel } from '../supplies/supply.model';
import { CreatePurchaseSupplyItemModel } from './create-purchase-supply-item.model';
import { CreatePurchaseSupplyModel } from './create-purchase-supply.model';
import { PurchaseSupplyItemModel } from './purchase-supply-item.model';
import { PurchaseSupplyModel } from './purchase-supply.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseSuppliesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private purchaseSupply: PurchaseSupplyModel|null = null;
  private provider: ProviderModel|null = null;
  private purchaseSupplyItems: CreatePurchaseSupplyItemModel[] = [];

  private purchaseSupplyItems$ = new BehaviorSubject<CreatePurchaseSupplyItemModel[]>([]);
  private provider$: Subject<ProviderModel|null> = new Subject();

  getPurchaseSupplyById(purchaseSupplyId: string): Observable<PurchaseSupplyModel> {
    return this.httpService.get(`purchaseSupplies/byId/${purchaseSupplyId}`);
  }

  getCountPurchaseSuppliesByRangeDate(
    startDate: number,
    endDate: number,
  ): Observable<number> {
    return this.httpService.get(`purchaseSupplies/countByRangeDatePage/${startDate}/${endDate}`);
  }

  getPurchaseSupplyItemsByRangeDate(
    startDate: number,
    endDate: number,
  ): Observable<number> {
    return this.httpService.get(`purchaseSupplies/itemsByRangeDatePage/${startDate}/${endDate}`);
  }

  getPurchaseSuppliesByRangeDatePage(
    startDate: number,
    endDate: number,
    pageIndex: number, 
    pageSize: number
  ): Observable<PurchaseModel[]> {
    return this.httpService.get(`purchaseSupplies/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`);
  }

  getPurchaseSuppliesByRangeDate(
    startDate: number,
    endDate: number,
  ): Observable<PurchaseModel[]> {
    return this.httpService.get(`purchaseSupplies/byRangeDate/${startDate}/${endDate}`);
  }

  getPurchaseSupplies(): Observable<PurchaseSupplyModel[]> {
    return this.httpService.get('purchaseSupplies');
  }

  getPurchaseSupplyItemsByPageSupply(pageIndex: number, pageSize: number, supplyId: string): Observable<PurchaseSupplyItemModel[]> {
    return this.httpService.get(`purchaseSupplies/purchaseSupplyItemsByPageSupply/${pageIndex}/${pageSize}/${supplyId}`);
  }

  getPurchaseSupplyItemsQuantityBySupply(supplyId: string): Observable<number> {
    return this.httpService.get(`purchaseSupplies/purchaseSupplyItemsQuantityBySupply/${supplyId}`);
  }

  getExpensesByYearOffice(year: number, officeId: string): Observable<number[]> {
    return this.httpService.get(`purchaseSupplies/byYearOffice/${year}/${officeId}`);
  }

  setPurchaseSupplyItems(purchaseItems: PurchaseSupplyItemModel[]) {
    this.purchaseSupplyItems = purchaseItems;
    this.purchaseSupplyItems$.next(this.purchaseSupplyItems);
  }

  setPurchaseSupply(purchaseSupply: PurchaseSupplyModel) {
    this.purchaseSupply = purchaseSupply;
  }

  getPurchaseSupply(): PurchaseSupplyModel|null {
    return this.purchaseSupply;
  }

  getPurchaseSupplyItems(): Observable<CreatePurchaseSupplyItemModel[]> {
    return this.purchaseSupplyItems$.asObservable();
  }

  updatePurchaseSupplyItem(index: number, purchaseSupplyItem: CreatePurchaseSupplyItemModel) {
    this.purchaseSupplyItems.splice(index, 1, purchaseSupplyItem);
    this.purchaseSupplyItems$.next(this.purchaseSupplyItems);
  }

  removePurchaseSupplyItem(index: number) {
    this.purchaseSupplyItems.splice(index, 1);
    this.purchaseSupplyItems$.next(this.purchaseSupplyItems);
  }

  setProvider(provider: ProviderModel|null) {
    this.provider = provider;
    this.provider$.next(this.provider);
  }

  getProvider() {
    return this.provider$.asObservable();
  }

  getPurchaseSupplyItem(index: number): CreatePurchaseSupplyItemModel {
    return this.purchaseSupplyItems[index];
  }

  addPurchaseItem(supply: SupplyModel) {
    const index = this.purchaseSupplyItems.findIndex(e => e.supplyId === supply._id && e.igvCode === supply.igvCode);
    if (index < 0) {
      const purchaseSupplyItem: CreatePurchaseSupplyItemModel = {
        sku: null,
        name: supply.name,
        fullName: supply.fullName,
        cost: supply.cost,
        quantity: 1,
        unitCode: supply.unitCode,
        igvCode: supply.igvCode,
        preIgvCode: supply.igvCode,
        supplyId: supply._id,
      };
      this.purchaseSupplyItems.push(purchaseSupplyItem);
    } else {
      const purchaseItem: CreatePurchaseSupplyItemModel = this.purchaseSupplyItems[index];
      purchaseItem.quantity += 1;
      this.purchaseSupplyItems.splice(index, 1, purchaseItem);
    }
    this.purchaseSupplyItems$.next(this.purchaseSupplyItems);
  }

  savePurchaseSupply(
    purchaseSupply: CreatePurchaseSupplyModel, 
    purchaseSupplyItems: CreatePurchaseSupplyItemModel[],
  ): Observable<PurchaseModel> {
    return this.httpService.post('purchaseSupplies', { purchaseSupply, purchaseSupplyItems });
  }

  updatePurchaseSupply(
    purchaseSupply: CreatePurchaseSupplyModel, 
    purchaseSupplyItems: CreatePurchaseSupplyItemModel[],
    purchaseSupplyId: string,
  ): Observable<PurchaseModel> {
    return this.httpService.put(`purchaseSupplies/${purchaseSupplyId}`, { purchaseSupply, purchaseSupplyItems });
  }

  deletePurchaseSupply(purchaseSupplyId: string): Observable<void> {
    return this.httpService.delete(`purchaseSupplies/${purchaseSupplyId}`);
  }
}
