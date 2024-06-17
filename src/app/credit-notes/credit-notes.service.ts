import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreateSaleItemModel } from '../sales/create-sale-item.model';
import { SaleModel } from '../sales/sale.model';
import { CdrNcModel } from './cdr-nc.model';
import { CreateCreditNoteItemModel } from './create-credit-note-item.model';
import { CreateCreditNoteModel } from './create-credit-note.model';
import { CreditNoteItemModel } from './credit-note-item.model';
import { CreditNoteModel } from './credit-note.model';

@Injectable({
    providedIn: 'root'
})
export class CreditNotesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private creditNote: CreditNoteModel | null = null;
    private creditNoteItems: CreateCreditNoteItemModel[] = [];
    private creditNoteItems$ = new BehaviorSubject<CreateCreditNoteItemModel[]>([]);

    setCreditNote(creditNote: CreditNoteModel): void {
        this.creditNote = creditNote;
    }

    getCreditNotesByRangeDatePageWithItems(
        startDate: Date,
        endDate: Date,
        pageIndex: number,
        pageSize: number
    ): Observable<CreditNoteModel[]> {
        return this.httpService.get(`creditNotes/byRangeDatePageWithItems/${startDate}/${endDate}/${pageIndex}/${pageSize}`);
    }

    getCdrByCreditNote(creditNoteId: string): Observable<CdrNcModel> {
        return this.httpService.get(`creditNotes/cdrxml/${creditNoteId}`);
    }

    updateDate(creditNote: any, creditNoteId: string): Observable<void> {
        return this.httpService.put(`creditNotes/updateDate/${creditNoteId}`, { creditNote });
    }

    cancelCreditNote(creditNoteId: string, reason: string) {
        return this.httpService.delete(`tickets/creditNote/${creditNoteId}/${reason}`);
    }

    getCreditNote(): CreditNoteModel | null {
        return this.creditNote;
    }

    getCreditNoteItem(index: number): CreateCreditNoteItemModel {
        return this.creditNoteItems[index];
    }

    addCreditNoteItem(product: ProductModel) {
        const index = this.creditNoteItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode);
        if (index < 0) {
            const creditNoteItem: CreateCreditNoteItemModel = {
                fullName: product.fullName,
                onModel: product.onModel,
                productId: product._id,
                price: product.price,
                quantity: 1,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                observations: '',
            };
            this.creditNoteItems.push(creditNoteItem);
        } else {
            const creditNoteItem: CreateCreditNoteItemModel = this.creditNoteItems[index];
            creditNoteItem.quantity += 1;
            this.creditNoteItems.splice(index, 1, creditNoteItem);
        }
        this.creditNoteItems$.next(this.creditNoteItems);
    }

    getCreditNoteItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<CreditNoteItemModel[]> {
        return this.httpService.get(`creditNotes/creditNoteItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    updateCreditNoteItem(index: number, creditNoteItem: CreateCreditNoteItemModel) {
        this.creditNoteItems.splice(index, 1, creditNoteItem);
        this.creditNoteItems$.next(this.creditNoteItems);
    }

    removeCreditNoteItem(index: number) {
        this.creditNoteItems.splice(index, 1);
        this.creditNoteItems$.next(this.creditNoteItems);
    }

    handleCreditNoteItems() {
        return this.creditNoteItems$.asObservable();
    }

    setCreditNoteItems(creditNoteItems: CreditNoteItemModel[]) {
        this.creditNoteItems = creditNoteItems;
        this.creditNoteItems$.next(this.creditNoteItems);
    }

    getById(creditId: string) {
        return this.httpService.get(`creditNotes/byId/${creditId}`);
    }

    getCreditNotesBySale(saleId: string): Observable<CreditNoteModel[]> {
        return this.httpService.get(`creditNotes/bySale/${saleId}`);
    }

    getCountQuantityCreditNoteItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`creditNotes/countQuantityCreditNoteItemsByProduct/${productId}`);
    }

    getCreditNoteById(creditNoteId: string): Observable<CreditNoteModel> {
        return this.httpService.get(`creditNotes/byId/${creditNoteId}`);
    }

    getCreditNotesByRangeDatePage(
        startDate: Date,
        endDate: Date,
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<CreditNoteModel[]> {
        return this.httpService.get(`creditNotes/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params);
    }

    getCountCreditNotesByRangeDate(startDate: Date, endDate: Date): Observable<number> {
        return this.httpService.get(`creditNotes/countCreditNotesByRangeDate/${startDate}/${endDate}`);
    }

    sendCreditNote(creditNoteId: string): Observable<CreditNoteModel> {
        return this.httpService.get(`creditNotes/sendCreditNote/${creditNoteId}`);
    }

    saveCreditNote(
        sale: SaleModel,
        creditNote: CreateCreditNoteModel,
        saleItems: CreateSaleItemModel[],
        saleId: string,
    ): Observable<CreditNoteModel> {
        return this.httpService.post(`creditNotes/${saleId}`, { sale, creditNote, saleItems });
    }

    updateCreditNote(
        creditNoteId: string,
        creditNote: CreditNoteModel,
    ): Observable<void> {
        return this.httpService.put(`creditNotes/${creditNoteId}`, { creditNote });
    }

    updateCreditNoteWithItems(
        creditNoteId: string,
        creditNote: CreateCreditNoteModel,
        creditNoteItems: CreateCreditNoteItemModel[],
    ): Observable<void> {
        return this.httpService.put(`creditNotes/withItems/${creditNoteId}`, { creditNote, creditNoteItems });
    }

    deleteBySale(saleId: string): Observable<void> {
        return this.httpService.delete(`creditNotes/bySale/${saleId}`);
    }

    deleteById(creditNoteId: string): Observable<void> {
        return this.httpService.delete(`creditNotes/byId/${creditNoteId}`);
    }

}
