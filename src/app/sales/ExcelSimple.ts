
import { formatDate } from '@angular/common'
import { BusinessModel } from '../businesses/business.model'
import { OfficeModel } from '../offices/office.model'
import { SaleModel } from '../sales/sale.model'
import { buildExcel } from '../buildExcel'
import { PaymentMethodModel } from '../payment-methods/payment-method.model'

export class ExcelSimple {

    constructor(
        private readonly startDate: string,
        private readonly endDate: string,
        private readonly business: BusinessModel,
        private readonly paymentMethods: PaymentMethodModel[]
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
            'H. EMISION',
            'RUC/DNI',
            'CLIENTE',
            'DIRECCION',
            'CELULAR',
            'TIPO COMPROBANTE',
            'Nº COMPROBANTE',
            'BASE',
            'IGV',
            'IMPORTE T.',
            'M. DE PAGO',
            'USUARIO',
            'OBSERVACIONES',
            'ANULADO'
        ])
    }

    addSales(
        sales: SaleModel[],
        office: OfficeModel
    ) {
        sales.reverse()
        for (const sale of sales) {
            const { customer, user } = sale
            let paymentNames = ''
            for (const payment of sale.payments) {
                const foundPaymentMethod = this.paymentMethods.find(e => e.id === payment.paymentMethodId)
                paymentNames += foundPaymentMethod?.name + ' '
            }
            this.body.push([
                formatDate(sale.createdAt, 'dd/MM/yyyy', 'en-US'),
                formatDate(sale.createdAt, 'h:mm', 'en-US'),
                customer?.document,
                customer?.name,
                customer?.address,
                customer?.phone,
                sale.invoiceName,
                `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`,
                Number((sale.charge - sale.igv).toFixed(2)),
                Number(sale.igv.toFixed(2)),
                Number(sale.charge.toFixed(2)),
                paymentNames,
                user.name,
                sale.observation,
                sale.deletedAt ? 'SI' : 'NO'
            ])
        }
    }

    buildExcel() {
        const name = `VENTAS_DESDE_${formatDate(this.startDate, 'dd/MM/yyyy', 'en-US')}_HASTA_${formatDate(this.endDate, 'dd/MM/yyyy', 'en-US')}_RUC_${this.business.ruc}`
        buildExcel(this.body, name, this.wscols, [35])
    }
}
