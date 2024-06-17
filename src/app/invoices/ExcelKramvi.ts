import { formatDate } from "@angular/common";
import { BusinessModel } from "../auth/business.model";
import { OfficeModel } from "../auth/office.model";
import { SaleModel } from "../sales/sale.model";
import { buildExcel } from "../buildExcel";

export class ExcelKramvi {

    constructor(
        private readonly startDate: string,
        private readonly endDate: string,
        private readonly business: BusinessModel
    ) {
        this.buildHeader()

        for (let index = 0; index < 50; index++) {
            this.wscols.push(18)
        }
    }

    private body: any[] = []
    private wscols: any[] = []

    buildHeader() {
        this.body.push([
            'F. EMISION',
            'RUC/DNI/CE',
            'CLIENTE',
            'COMPROBANTE',
            'SERIE',
            'CORRELATIVO',
            'MONEDA',
            'BASE',
            'IMPORTE T.',
            'IGV',
            'RC',
            'GRAVADO',
            'EXONERADO',
            'INAFECTO',
            'GRATUITO',
            'ESTADO',
            'ANULADO',
            'F. PAGO',
            'PERSONAL',
            'USUARIO',
        ])
    }

    addSales(
        sales: SaleModel[],
        office: OfficeModel
    ) {
        for (const sale of sales) {
            const { customer } = sale
            const declare = this.getStatusDeclare(sale)
            this.body.push([
                formatDate(sale.emitionAt, 'dd/MM/yyyy', 'en-US'),
                customer?.document,
                (customer?.name || 'VARIOS').toUpperCase(),
                sale.invoiceType,
                `${sale.invoicePrefix}${office.serialPrefix}`,
                sale.invoiceNumber,
                sale.currencyCode,
                declare ? Number((sale.charge - sale.igv).toFixed(2)) : null,
                declare ? Number((sale.charge || 0).toFixed(2)) : null,
                declare ? Number((sale.igv || 0).toFixed(2)) : null,
                declare ? Number((sale.rc || 0).toFixed(2)) : null,
                declare ? Number((sale.gravado || 0).toFixed(2)) : null,
                declare ? Number((sale.exonerado || 0).toFixed(2)) : null,
                declare ? Number((sale.inafecto || 0).toFixed(2)) : null,
                declare ? Number((sale.gratuito || 0).toFixed(2)) : null,
                `${this.getStatus(sale)}`,
                sale.deletedAt ? 'SI' : 'NO',
                sale.isPaid ? 'CONTADO' : 'CREDITO',
                sale.worker ? sale.worker.name.toUpperCase() : null,
                sale.user.name.toUpperCase()
            ])
        }
    }

    getStatusDeclare(sale: SaleModel): boolean {
        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '0') {
            return false
        }
        if (sale.cdr === null) {
            return false
        }
        if (sale.cdr.sunatCode !== '0') {
            return false
        }
        return true
    }

    getStatus(sale: SaleModel) {
        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '98') {
            return 'PROCESANDO'
        }

        if (sale.deletedAt && sale.ticket && sale.ticket.sunatCode === '0') {
            return 'ANULADO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '2108') {
            return 'RECHAZADO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '98') {
            return 'PROCESANDO'
        }

        if (sale.cdr && sale.cdr.sunatCode === '0') {
            return 'ACEPTADO'
        }

        return 'PENDIENTE'
    }

    builExcel() {
        const name = `VENTAS_DESDE_${formatDate(this.startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(this.endDate, 'dd/MM/yyyy', 'en-US')}_RUC_${this.business.ruc}`
        buildExcel(this.body, name, this.wscols, [35])
    }
}