import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'
import { CdrModel } from '../sales/cdr.model'

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCdr(cdrId: any): Promise<Blob> {
        const url = `invoices/cdrByCdr/${cdrId}`
        return this.httpService.getFile(url)
    }

    getXml(cdrId: any): Promise<Blob> {
        const url = `invoices/xmlByCdr/${cdrId}`
        return this.httpService.getFile(url)
    }

    generateXml(saleId: any) {
        return this.httpService.get(`invoices/generateXml/${saleId}`)
    }

    getBadCdrs(): Observable<CdrModel[]> {
        return this.httpService.get('invoices/badCdrs');
    }

    getCdrsByRangeDate(
        startDate: Date,
        endDate: Date,
        params: Params,
    ): Observable<CdrModel[]> {
        return this.httpService.get(`invoices/cdrsByRangeDate/${startDate}/${endDate}`, params);
    }

    getCheckCdrs(
        salesId: any[],
    ): Observable<CdrModel[]> {
        return this.httpService.post(`invoices/checkCdrs`, { salesId });
    }

    statusCdr(saleId: any): Observable<CdrModel> {
        return this.httpService.get(`invoices/statusCdr/${saleId}`);
    }

    cancelInvoice(saleId: any, deletedReason: string): Observable<any> {
        return this.httpService.delete(`tickets/invoice/${saleId}/${deletedReason}`);
    }

    softDeleteInvoice(saleId: any, deletedReason: string): Observable<any> {
        return this.httpService.delete(`sales/${saleId}/${deletedReason}`)
    }

    sendInvoice(saleId: any) {
        return this.httpService.get(`invoices/send/${saleId}`);
    }

    sendDeleteInvoice(saleId: any) {
        return this.httpService.get(`invoices/sendDelete/${saleId}`);
    }

    sendInvoiceMassive(saleIds: number[]) {
        return this.httpService.post('invoices/sendMassive', { saleIds });
    }

    copyInvoiceMassive(salesId: any[]) {
        return this.httpService.post('invoices/copyMassive', { salesId });
    }

    deleteCdr(cdrId: any) {
        return this.httpService.delete(`invoices/${cdrId}`);
    }

    deleteTicket(ticketId: any) {
        return this.httpService.delete(`tickets/${ticketId}`);
    }

    getDeleteTicketBySale(saleId: any): Observable<CdrModel> {
        return this.httpService.get(`tickets/deleteTicketBySale/${saleId}`);
    }

    deleteCdrTicket(saleId: any) {
        return this.httpService.delete(`tickets/deleteCdrTicket/${saleId}`);
    }

}
