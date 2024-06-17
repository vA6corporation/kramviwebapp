import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateDueModel } from '../dues/create-due.model';
import { HttpService } from '../http.service';
import { SaleSupplyItemModel } from '../inventory-supplies/sale-supply-item.model';
import { CreatePaymentModel } from '../payments/create-payment.model';
import { ProductModel } from '../products/product.model';
import { CreateCreditModel } from './create-credit.model';
import { CreateSaleItemModel } from './create-sale-item.model';
import { CreateSaleModel } from './create-sale.model';
import { OutStockModel } from './out-stock.model';
import { SaleItemModel } from './sale-item.model';
import { SaleModel } from './sale.model';
import { SummarySaleItemModel } from './summary-sale-item.model';
import { UpdateSaleModel } from './update-sale.model';
import { LotModel } from '../lots/lot.model';
import { CreateBoardItemModel } from '../boards/create-board-item.model';

@Injectable({
    providedIn: 'root'
})
export class SalesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private sale: SaleModel | null = null
    private saleItems: CreateSaleItemModel[] = []
    private saleItems$ = new BehaviorSubject<CreateSaleItemModel[]>([])

    setSale(sale: SaleModel) {
        this.sale = sale;
    }

    updateTicket(ticket: any, ticketId: string) {
        return this.httpService.put(`tickets/${ticketId}`, { ticket })
    }

    updateCdr(cdr: any, cdrId: string) {
        return this.httpService.put(`invoices/${cdrId}`, { cdr })
    }

    getSale(): SaleModel | null {
        return this.sale
    }

    getSalesByRangeDateDeliveryAt(startDate: Date, endDate: Date): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byRangeDateDeliveryAt/${startDate}/${endDate}`)
    }

    getSalesByPageTurn(pageIndex: number, pageSize: number, turnId: string): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byPageTurn/${pageIndex}/${pageSize}/${turnId}`)
    }

    getCountSalesByTurn(turnId: string): Observable<number> {
        return this.httpService.get(`sales/countByTurn/${turnId}`)
    }

    getSaleItemsByCustomerPage(
        customerId: string,
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<SaleItemModel[]> {
        return this.httpService.get(`sales/saleItemsByCustomerPage/${customerId}/${pageIndex}/${pageSize}`, params)
    }

    countSaleItemsByCustomer(
        customerId: string,
        params: Params,
    ): Observable<number> {
        return this.httpService.get(`sales/countSaleItemsByCustomer/${customerId}`, params)
    }

    getSalesOfTheDay(): Observable<SaleModel[]> {
        return this.httpService.get('sales/salesOfTheDay')
    }

    getSalesByKey(key: string): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byKey/${key}`)
    }

    getSalesByTurn(turnId: string): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byTurn/${turnId}`)
    }

    getCountQuantitySaleItemsByProduct(
        productId: string,
    ): Observable<number> {
        return this.httpService.get(`sales/countQuantitySaleItemsByProduct/${productId}`)
    }

    getSaleItemsByPageProduct(
        pageIndex: number,
        pageSize: number,
        productId: string,
        params: Params,
    ): Observable<SaleItemModel[]> {
        return this.httpService.get(`sales/saleItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params)
    }

    getCharge(): number {
        let sum = 0
        for (const saleItem of this.saleItems) {
            if (saleItem.igvCode !== '11') {
                sum += saleItem.price * saleItem.quantity
            }
        }
        return sum
    }

    getSaleById(saleId: string): Observable<SaleModel> {
        return this.httpService.get(`sales/byId/${saleId}`)
    }

    getInvoicesByPage(pageIndex: number, pageSize: number): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byPage/${pageIndex}/${pageSize}`)
    }

    getSalesByRangeDatePage(
        startDate: Date,
        endDate: Date,
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    getCountSalesByRangeDate(
        startDate: Date,
        endDate: Date,
        params: Params,
    ): Observable<number> {
        return this.httpService.get(`sales/countByRangeDate/${startDate}/${endDate}`, params)
    }

    getSalesWithDetailsByRangeDatePage(
        startDate: Date,
        endDate: Date,
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<SaleModel[]> {
        return this.httpService.get(`sales/withDetailsByRangeDatePage/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    getSalesByRangeDatePageTax(
        startDate: string,
        endDate: string,
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<SaleModel[]> {
        return this.httpService.get(`sales/byRangeDatePageTax/${startDate}/${endDate}/${pageIndex}/${pageSize}`, params)
    }

    getCountByRangeDate(startDate: Date, endDate: Date, params: Params): Observable<number> {
        return this.httpService.get(`sales/countByRangeDate/${startDate}/${endDate}`, params)
    }

    getCountByRangeDateTax(startDate: Date, endDate: Date, params: Params): Observable<number> {
        return this.httpService.get(`sales/countByRangeDateTax/${startDate}/${endDate}`, params)
    }

    getSummarySaleItemsByTurn(turnId: string): Observable<SummarySaleItemModel[]> {
        return this.httpService.get(`sales/summarySaleItemsByTurn/${turnId}`)
    }

    getSummarySaleItemsByRangeDate(
        startDate: Date,
        endDate: Date,
        params: Params
    ): Observable<SummarySaleItemModel[]> {
        return this.httpService.get(`sales/summarySaleItemsByRangeDate/${startDate}/${endDate}`, params)
    }

    getSaleSupplyItemsByPageSupply(
        pageIndex: number,
        pageSize: number,
        supplyId: string,
    ): Observable<SaleSupplyItemModel[]> {
        return this.httpService.get(`sales/saleSupplyItemsByPageSupply/${pageIndex}/${pageSize}/${supplyId}`)
    }

    getSaleSupplyItemsQuantityBySupply(
        supplyId: string,
    ): Observable<number> {
        return this.httpService.get(`sales/saleSupplyItemsQuantityBySupply/${supplyId}`)
    }

    getSaleItemDetails(saleItemIds: string[]) {
        return this.httpService.post('saleItems/saleItemDetails', { saleItemIds })
    }

    handleSaleItems(): Observable<CreateSaleItemModel[]> {
        return this.saleItems$.asObservable()
    }

    getSaleItem(index: number): CreateSaleItemModel {
        return this.saleItems[index]
    }

    setSaleItems(saleItems: CreateSaleItemModel[]) {
        this.saleItems = saleItems
        this.saleItems$.next(this.saleItems)
    }

    forceAddSaleItem(
        product: ProductModel,
        annotation: string = "",
    ): number {
        const saleItem: CreateSaleItemModel = {
            fullName: product.fullName,
            onModel: product.onModel,
            productId: product._id,
            price: product.price,
            quantity: 1,
            isTrackStock: product.isTrackStock,
            unitCode: product.unitCode,
            igvCode: product.igvCode,
            preIgvCode: product.igvCode,
            observations: annotation,
            prices: product.prices,
        }
        const index = this.saleItems.push(saleItem)
        this.saleItems$.next(this.saleItems)
        return index - 1
    }

    addSaleItemWithLot(
        product: ProductModel,
        quantity: number,
        lot: LotModel
    ): number {
        const index = this.saleItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode)
        if (index < 0) {
            const saleItem: CreateSaleItemModel = {
                fullName: product.fullName,
                onModel: product.onModel,
                price: product.price,
                quantity,
                isTrackStock: product.isTrackStock,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                observations: '',
                prices: product.prices,
                productId: product._id,
                lot
            }
            const newIndex = this.saleItems.push(saleItem)
            this.saleItems$.next(this.saleItems)
            return newIndex - 1
        } else {
            const saleItem: CreateSaleItemModel = this.saleItems[index]
            saleItem.quantity = quantity
            saleItem.lot = lot
            this.saleItems.splice(index, 1, saleItem)
            this.saleItems$.next(this.saleItems)
            return index
        }
    }

    addSaleItem(
        product: ProductModel,
        annotation: string = '',
    ): number {
        const index = this.saleItems.findIndex(e => e.productId === product._id && e.igvCode === product.igvCode && e.observations === annotation)
        if (index < 0) {
            const saleItem: CreateSaleItemModel = {
                fullName: product.fullName,
                onModel: product.onModel,
                price: product.price,
                quantity: 1,
                isTrackStock: product.isTrackStock,
                unitCode: product.unitCode,
                igvCode: product.igvCode,
                preIgvCode: product.igvCode,
                observations: annotation || '',
                prices: product.prices,
                productId: product._id,
            }
            const newIndex = this.saleItems.push(saleItem)
            this.saleItems$.next(this.saleItems)
            return newIndex - 1
        } else {
            const saleItem: CreateSaleItemModel = this.saleItems[index]
            saleItem.quantity += 1
            this.saleItems.splice(index, 1, saleItem)
            this.saleItems$.next(this.saleItems)
            return index
        }
    }

    updateSaleItem(index: number, saleItem: CreateSaleItemModel) {
        this.saleItems.splice(index, 1, saleItem)
        this.saleItems$.next(this.saleItems)
    }

    removeSaleItem(index: number) {
        this.saleItems.splice(index, 1)
        this.saleItems$.next(this.saleItems)
    }

    saveSale(
        sale: CreateSaleModel,
        saleItems: CreateSaleItemModel[] | CreateBoardItemModel[],
        payments: CreatePaymentModel[],
        params: Params,
    ): Observable<SaleModel> {
        return this.httpService.post('sales', {
            sale,
            saleItems,
            payments,
        }, params)
    }

    saveSaleStock(
        sale: CreateSaleModel,
        saleItems: CreateSaleItemModel[],
        payments: CreatePaymentModel[],
        params: Params,
    ): Observable<{ sale: SaleModel | null, outStocks: OutStockModel[] }> {
        return this.httpService.post('sales/withStock', {
            sale,
            saleItems,
            payments,
        }, params)
    }

    saveCredit(
        credit: CreateCreditModel,
        saleItems: CreateSaleItemModel[],
        payments: CreatePaymentModel[],
        dues: CreateDueModel[],
        params: Params,
    ): Observable<SaleModel> {
        return this.httpService.post('credits', {
            credit,
            saleItems,
            payments,
            dues
        }, params)
    }

    saveCreditStock(
        credit: CreateCreditModel,
        saleItems: CreateSaleItemModel[],
        payments: CreatePaymentModel[],
        dues: CreateDueModel[],
        params: Params,
    ): Observable<{ sale: SaleModel | null, outStocks: OutStockModel[] }> {
        return this.httpService.post('credits/withStock', { credit, saleItems, payments, dues }, params)
    }

    updateSaleWithItems(sale: UpdateSaleModel, saleItems: CreateSaleItemModel[], payments: CreatePaymentModel[], saleId: string,): Observable<void> {
        return this.httpService.put(`sales/withItems/${saleId}`, { sale, saleItems, payments })
    }

    updateSale(sale: SaleModel, saleId: string): Observable<void> {
        return this.httpService.put(`sales/${saleId}`, { sale })
    }

    updateDateSale(sale: SaleModel, saleId: string): Observable<void> {
        return this.httpService.put(`sales/updateDate/${saleId}`, { sale })
    }

    updateDeleteSale(sale: SaleModel, saleId: string): Observable<void> {
        return this.httpService.put(`sales/updateDelete/${saleId}`, { sale })
    }

    updateExpirationAt(saleId: string, expirationAt: Date) {
        return this.httpService.get(`sales/updateExpirationAt/${saleId}/${expirationAt}`)
    }

    updateDues(saleId: string, dues: number) {
        return this.httpService.get(`sales/updateDues/${saleId}/${dues}`)
    }

    changeSale(sale: CreateSaleModel, saleId: string, deletedReason: string): Observable<SaleModel> {
        return this.httpService.post(`sales/change/${saleId}/${deletedReason}`, { sale })
    }

    delete(saleId: string): Observable<void> {
        return this.httpService.delete(`sales/${saleId}`)
    }

    deleteMassive(salesId: string[]): Observable<void> {
        return this.httpService.post(`sales/deleteMassive`, { salesId })
    }

    sendEmail(email: string, saleId: string): Observable<void> {
        return this.httpService.get(`emails/sendEmail/${email}/${saleId}`)
    }

}
