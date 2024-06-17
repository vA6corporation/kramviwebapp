import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { CdrModel } from './cdr.model';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getCdr(cdrId: string): Promise<Blob> {
        const url = `invoices/cdrByCdr/${cdrId}`
        return this.httpService.getFile(url)
    }

    getXml(cdrId: string): Promise<Blob> {
        const url = `invoices/xmlByCdr/${cdrId}`
        return this.httpService.getFile(url)
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
        salesId: string[],
    ): Observable<CdrModel[]> {
        return this.httpService.post(`invoices/checkCdrs`, { salesId });
    }

    statusCdr(saleId: string): Observable<CdrModel> {
        return this.httpService.get(`invoices/statusCdr/${saleId}`);
    }

    cancelInvoice(saleId: string, reason: string): Observable<any> {
        return this.httpService.delete(`tickets/invoice/${saleId}/${reason}`);
    }

    softDeleteInvoice(saleId: string, deletedReason: string): Observable<any> {
        return this.httpService.delete(`sales/${saleId}/${deletedReason}`)
    }

    sendInvoice(saleId: string) {
        return this.httpService.get(`invoices/send/${saleId}`);
    }

    sendDeleteInvoice(saleId: string) {
        return this.httpService.get(`invoices/sendDelete/${saleId}`);
    }

    sendInvoiceMassive(saleIds: string[]) {
        return this.httpService.post('invoices/sendMassive', { saleIds });
    }

    copyInvoiceMassive(salesId: string[]) {
        return this.httpService.post('invoices/copyMassive', { salesId });
    }

    deleteCdr(cdrId: string) {
        return this.httpService.delete(`invoices/${cdrId}`);
    }

    deleteTicket(ticketId: string) {
        return this.httpService.delete(`tickets/${ticketId}`);
    }

    getDeleteTicketBySale(saleId: string): Observable<CdrModel> {
        return this.httpService.get(`tickets/deleteTicketBySale/${saleId}`);
    }

    deleteCdrTicket(saleId: string) {
        return this.httpService.delete(`tickets/deleteCdrTicket/${saleId}`);
    }

}
