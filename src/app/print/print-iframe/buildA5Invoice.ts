import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import * as QRCode from 'qrcode';
import { SaleModel } from "../../sales/sale.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA5Invoice(
    sale: SaleModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8.5
    const { saleItems, customer } = sale

    let invoiceTitle = ''

    switch (sale.invoiceType) {
        case 'FACTURA':
            invoiceTitle = 'FACTURA ELECTRONICA'
            break
        case 'BOLETA':
            invoiceTitle = 'BOLETA DE VENTA ELECTRONICA'
            break
        default:
            invoiceTitle = 'NOTA DE VENTA'
            break
    }

    const pdf = new jsPDF('p', 'mm', [210, 148])
    let text: string = ''
    let strArr: string[] = []
    const pageCenter = 74
    const pageHeight = pdf.internal.pageSize.height
    if (setting?.logo) {
        pdf.addImage(setting.logo, "JPEG", 5, 5, 33, 33)
    }

    let positionYTitle = 10

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)

    text = (office?.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    pdf.setFont('Helvetica', 'normal')

    text = (business?.businessName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    text = `${office?.address.toLowerCase()}`
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    if (office.mobileNumber) {
        text = `${office?.mobileNumber}`
        pdf.text(text, 45, positionYTitle)
        positionYTitle += 7
    } else {
        positionYTitle += 3
    }

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, pageCenter, positionYTitle, { align: 'center' })

    positionYTitle += 5

    text = invoiceTitle || ''
    pdf.text(text, pageCenter, positionYTitle, { align: 'center' })

    positionYTitle += 5

    text = `${sale?.invoicePrefix}${office?.serialPrefix}-${sale?.invoiceNumber}`
    pdf.text(text, pageCenter, positionYTitle, { align: 'center' })

    positionYTitle += 7

    pdf.setFontSize(body)

    let positionYCustomer = positionYTitle
    let plusHeight = 0

    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (customer?.addresses[sale.addressIndex] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA', 8, positionYCustomer)
    pdf.text(':', 32, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = formatDate(sale.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 4

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SEÑOR(es)', 8, positionYCustomer)
    pdf.text(':', 32, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 100)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 4 * strArr.length

    if (customer?.document) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('RUC/DNI', 8, positionYCustomer)
        pdf.text(':', 32, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = customer?.document || ''
        pdf.text(text, 35, positionYCustomer)
        positionYCustomer += 4
    }

    if (customer?.addresses[sale.addressIndex]) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('DIRECCIÓN', 8, positionYCustomer)
        pdf.text(':', 32, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = (customer?.addresses[sale.addressIndex] || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 100)
        pdf.text(strArr, 35, positionYCustomer)

        positionYCustomer += 4 * strArr.length
    }

    if (customer?.mobileNumber) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('TELEFONO', 8, positionYCustomer)
        pdf.text(':', 32, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = (customer?.mobileNumber || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 90)
        pdf.text(strArr, 35, positionYCustomer)

        positionYCustomer += 4
    }

    pdf.setFont('Helvetica', 'bold')
    pdf.text('F. DE PAGO', 8, positionYCustomer)
    pdf.text(':', 32, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = sale.isCredit ? 'CREDITO' : 'CONTADO'
    pdf.text(text, 35, positionYCustomer)

    if (sale.deliveryAt) {
        positionYCustomer += 4
        pdf.setFont('Helvetica', 'bold')
        pdf.text('F. DE ENTREGA', 8, positionYCustomer)
        pdf.text(':', 32, positionYCustomer)
        pdf.setFont('Helvetica', 'normal')
        text = formatDate(sale.deliveryAt, 'dd/MM/yyyy', 'en-US')
        pdf.text(text, 35, positionYCustomer)
    }

    positionYCustomer += 4

    pdf.setFont('Helvetica', 'bold')

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(sale.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 170, 50)

    text = sale.isPaid ? 'CONTADO' : 'CREDITO'
    pdf.text(text, 170, 60)

    text = sale?.observations || 'NINGUNO'
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 170, 65)

    let positionYColumns = positionYCustomer

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 138, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(20, positionYColumns, 20, positionYColumns + 7)
    pdf.line(100, positionYColumns, 100, positionYColumns + 7)
    pdf.line(120, positionYColumns, 120, positionYColumns + 7)

    text = 'Cant.'
    pdf.text(text, 7, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 23, positionYColumns + 5)

    text = 'Pre. Unit'
    pdf.text(text, 103, positionYColumns + 5)

    text = 'Sub. Total'
    pdf.text(text, 123, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 7

    for (const saleItem of saleItems || []) {
        text = saleItem.quantity.toFixed(2)
        pdf.text(text, 7, positionYitems)

        text = saleItem.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 75)
        pdf.text(strArr, 23, positionYitems)

        text = saleItem.price.toFixed(2)
        pdf.text(text, 105, positionYitems)

        text = (saleItem.price * saleItem.quantity).toFixed(2)
        pdf.text(text, 125, positionYitems)

        positionYitems += 4 * strArr.length

        if (positionYitems >= pageHeight - 37) {
            pdf.addPage()
            positionYitems = 5
        }
    }

    positionYitems += 3

    text = `SON: ${sale?.chargeLetters}`
    pdf.text(text, 5, positionYitems)

    positionYitems += 4

    let positionYSummary = positionYitems
    let positionYSummaryRight = positionYitems

    if (sale && business && office) {
        const qrcode = await getQRDataUrl(sale, business, office)
        pdf.addImage(qrcode, "JPEG", 5, positionYSummary, 35, 35)
    }

    positionYSummary += 4
    positionYSummaryRight += 4
    pdf.setFont('Helvetica', 'bold')

    text = 'DSCTO GLOBAL'
    pdf.text(text, 90, positionYSummary, { align: 'right' })
    positionYSummary += 4

    if (sale.invoiceType !== 'NOTA DE VENTA') {
        text = 'SUB TOTAL'
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4

        text = 'OP. GRAVADO'
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4

        text = 'OP. EXONERADO'
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4

        text = 'OP. INAFECTO'
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4

        text = 'OP. GRATUITO'
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4

        text = `I.G.V. ${sale.igvPercent}%`
        pdf.text(text, 90, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    text = 'IMPORTE TOTAL'
    pdf.text(text, 90, positionYSummary, { align: 'right' })
    positionYSummary += 4

    pdf.setFont('Helvetica', 'normal')

    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    text = (sale?.discount || 0).toFixed(2)
    pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    if (sale.invoiceType !== 'NOTA DE VENTA') {
        text = ((sale?.charge || 0) - (sale?.igv || 0)).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        text = (sale?.gravado || 0).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        text = (sale?.exonerado || 0).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        text = (sale?.inafecto || 0).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        text = (sale?.gratuito || 0).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        text = (sale?.igv || 0).toFixed(2)
        pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    text = (sale?.charge || 0).toFixed(2)
    pdf.text(text, 120, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 105, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 4

    return pdf
}

async function getQRDataUrl(sale: SaleModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${sale.invoiceType.toUpperCase()}|${sale.invoicePrefix}${office.serialPrefix}|${sale.invoiceNumber}|${sale.igv.toFixed(2)}|${sale.charge.toFixed(2)}|${sale.createdAt}`, { margin: 0 })
}