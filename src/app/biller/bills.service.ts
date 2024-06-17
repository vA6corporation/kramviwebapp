import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CreateDueModel } from '../dues/create-due.model';
import { HttpService } from '../http.service';
import { PaymentModel } from '../payments/payment.model';
import { SaleModel } from '../sales/sale.model';
import { BillItemModel } from './bill-item.model';
import { CreateSaleModel } from '../sales/create-sale.model';
import { CreateCreditModel } from '../sales/create-credit.model';
import { UpdateSaleModel } from '../sales/update-sale.model';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private billItems: BillItemModel[] = [];
  private billItems$: Subject<BillItemModel[]> = new Subject(); 

  setBillItems(billItems: BillItemModel[]) {
    this.billItems = billItems;
    this.billItems$.next(this.billItems);
  }

  getBillItem(index: number): BillItemModel {
    return this.billItems[index];
  }

  updateBillItem(billItem: BillItemModel, index: number,) {
    this.billItems.splice(index, 1, billItem);
    this.billItems$.next(this.billItems);
  }

  removeBillItem(index: number) {
    this.billItems.splice(index, 1);
    this.billItems$.next(this.billItems);
  }

  handleBillItems(): Observable<BillItemModel[]> {
    return this.billItems$.asObservable();
  }
  
  addBillItem(billItem: BillItemModel) {
    this.billItems.push(billItem);
    this.billItems$.next(this.billItems);
  }

  saveBill(
    sale: CreateSaleModel|CreateCreditModel, 
    saleItems: BillItemModel[], 
    payments: PaymentModel[], 
    dues: CreateDueModel[]
  ): Observable<SaleModel> {
    return this.httpService.post('sales/bill', { sale, saleItems, payments, dues });
  }

  saveBillCredit(
    credit: CreateCreditModel, 
    saleItems: BillItemModel[], 
    payments: PaymentModel[], 
    dues: CreateDueModel[]
  ): Observable<SaleModel> {
    return this.httpService.post('credits/bill', { credit, saleItems, payments, dues });
  }

  updateBill(
    sale: UpdateSaleModel, 
    saleItems: BillItemModel[], 
    payments: PaymentModel[], 
    saleId: string
  ): Observable<void> {
    return this.httpService.put(`sales/bill/${saleId}`, { sale, saleItems, payments });
  }
}
