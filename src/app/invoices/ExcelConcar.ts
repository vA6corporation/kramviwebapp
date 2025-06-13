import { formatDate } from "@angular/common";
import { BusinessModel } from "../auth/business.model";
import { OfficeModel } from "../auth/office.model";
import { SaleModel } from "../sales/sale.model";
import { buildExcel } from "../buildExcel";

interface OfficeSales {
    [key: string]: SaleModel[]
}

export class ExcelConcar {

    constructor(
        private readonly startDate: string,
        private readonly endDate: string,
        private readonly offices: OfficeModel[],
        private readonly business: BusinessModel,
    ) {
        for (let index = 0; index < 50; index++) {
            this.wscols.push(18)
        }
    }

    private startIndex: number = 0
    private body: any[] = []
    private wscols: any[] = []
    private officeSales: OfficeSales = {}

    buildHeader() {
        this.body.unshift([
            'Campo',
            'Sub Diario',
            'Número de Comprobante',
            'Fecha de Comprobante',
            'Código de Moneda',
            'Glosa Principal',
            'Tipo de Cambio',
            'Tipo de Conversión',
            'Flag de Conversión de Moneda',
            'Fecha Tipo de Cambio',
            'Cuenta Contable',
            'Código de Anexo',
            'Código de Centro de Costo',
            'Debe / Haber',
            'Importe Original',
            'Importe en Dólares',
            'Importe en Soles',
            'Tipo de Documento',
            'Número de Documento',
            'Fecha de Documento',
            'Fecha de Vencimiento',
            'Código de Area',
            'Glosa Detalle',
            'Código de Anexo Auxiliar',
            'Medio de Pago',
            'Tipo de Documento de Referencia',
            'Número de Documento Referencia',
            'Fecha Documento Referencia',
            'Nro Máq. Registradora Tipo Doc. Ref.',
            'Base Imponible Documento Referencia',
            'IGV Documento Provisión',
            'Tipo Referencia en estado MQ',
            'Número Serie Caja Registradora',
            'Fecha de Operación',
            'Tipo de Tasa',
            'Tasa Detracción/Percepción',
            'Importe Base Detracción/Percepción Dólares',
            'Importe Base Detracción/Percepción Soles',
            "Tipo Cambio para 'F'",
            'Importe de IGV sin Derecho Crédito Fiscal',
        ])
    }

    addSales(
        sales: SaleModel[],
        office: OfficeModel
    ) {
        let officeSales = this.officeSales[office._id]
        if (officeSales) {
            this.officeSales[office._id] = [...officeSales, ...sales]
        } else {
            this.officeSales[office._id] = sales
        }
    }

    buildBody(
        sales: SaleModel[],
        office: OfficeModel
    ) {
        sales.forEach((sale, index) => {
            index += this.startIndex;
            this.body.push([
                '',
                '05',
                this.formatSerie(sale, index),
                this.formatDateSlash(sale.emitionAt),
                'MN',
                this.formatGlosa(sale),
                0,
                'V',
                'S',
                this.formatDateSlash(sale.emitionAt),
                // '121202',
                sale.currencyCode === 'PEN' ? '121201' : '121202',
                this.formatCodigoAnexo(sale),
                '',
                'D',
                sale.cdr && sale.cdr.sunatCode === '0' ? Number(sale.charge.toFixed(2)) : 0,
                0,
                0,
                sale.invoiceCode === '01' ? 'FT' : 'BV',
                `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`,
                this.formatDateSlash(sale.emitionAt),
                this.formatDateSlash(sale.emitionAt),
                '',
                this.formatGlosa(sale),
            ])

            this.body.push([
                '',
                '05',
                this.formatSerie(sale, index),
                this.formatDateSlash(sale.emitionAt),
                'MN',
                this.formatGlosa(sale),
                0,
                'V',
                'S',
                this.formatDateSlash(sale.emitionAt),
                '401111',
                this.formatCodigoAnexo(sale),
                '',
                'H',
                sale.cdr && sale.cdr.sunatCode === '0' ? Number(sale.igv.toFixed(2)) : 0,
                0,
                0,
                sale.invoiceCode === '01' ? 'FT' : 'BV',
                `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`,
                this.formatDateSlash(sale.emitionAt),
                this.formatDateSlash(sale.emitionAt),
                '',
                this.formatGlosa(sale),
            ])

            this.body.push([
                '',
                '05',
                this.formatSerie(sale, index),
                this.formatDateSlash(sale.emitionAt),
                'MN',
                this.formatGlosa(sale),
                0,
                'V',
                'S',
                this.formatDateSlash(sale.emitionAt),
                '701211',
                this.formatCodigoAnexo(sale),
                '',
                'H',
                sale.cdr && sale.cdr.sunatCode === '0' ? Number((sale.charge - sale.igv).toFixed(2)) : 0,
                0,
                0,
                sale.invoiceCode === '01' ? 'FT' : 'BV',
                `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`,
                this.formatDateSlash(sale.emitionAt),
                this.formatDateSlash(sale.emitionAt),
                '',
                this.formatGlosa(sale),
            ])
        })

        this.startIndex += sales.length
    }

    builExcel() {
        let name = `CONCAR_VENTAS_${formatDate(this.startDate, 'dd/MM/yyyy', 'en-US')}_AL_${formatDate(this.endDate, 'dd/MM/yyyy', 'en-US')}_RUC_${this.business.ruc}`
        this.buildHeader()
        for (const [key, sales] of Object.entries(this.officeSales)) {
            const foundOffice = this.offices.find(e => e._id === key)
            if (foundOffice) {
                sales.reverse()
                this.buildBody(sales, foundOffice)
            }
        }
        buildExcel(this.body, name, this.wscols, [35])
    }

    private formatCodigoAnexo(sale: SaleModel) {
        switch (sale.invoiceType) {
            case 'BOLETA':
                if (sale.deletedAt || sale.cdr?.sunatCode !== '0') {
                    return '0001'
                } else {
                    return '003'
                }
            case 'FACTURA': {
                let customer = sale.customer
                if (sale.deletedAt || sale.cdr?.sunatCode !== '0') {
                    return '0001'
                } else {
                    return customer?.document
                }
            }
        }
        return ''
    }

    private formatSerie(sale: SaleModel, index: number) {
        var stringText = (index + 1).toString()
        var month = new Date(sale.emitionAt).getMonth() + 1
        switch (stringText.length) {
            case 1:
                stringText = `000${stringText}`
                break
            case 2:
                stringText = `00${stringText}`
                break
            case 3:
                stringText = `0${stringText}`
                break
        }
        if (month > 9) {
            return `${month}${stringText}`
        } else {
            return `0${month}${stringText}`
        }
    }

    private formatDateSlash(date: string) {
        var d = new Date(date)
        var month = '' + (d.getMonth() + 1)
        var day = '' + d.getDate()
        var year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [day, month, year].join('/')
    }

    private formatGlosa(sale: SaleModel) {
        switch (sale.invoiceType) {
            case 'BOLETA':
                return 'VENTA DEL DIA'
            case 'FACTURA': {
                let customer = sale.customer
                return customer?.name.toUpperCase()
            }
        }
        return ''
    }
}