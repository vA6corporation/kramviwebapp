import { formatDate } from '@angular/common'
import * as QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { SaleModel } from '../../sales/sale.model'
import { SettingModel } from '../../settings/setting.model'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { BankModel } from '../../banks/bank.model'
import { InvoiceCode } from '../../sales/invoice-code.enum'

export async function buildTicket80mm(
    sale: SaleModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[],
    paymentMethods: PaymentMethodModel[],
    urlLogo: string
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const pageCenter = 35
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { saleItems, customer, user, payments } = sale

    let invoiceTitle = ''
    let sunatMessage = ''

    switch (sale.invoiceCode) {
        case InvoiceCode.FACTURA:
            invoiceTitle = 'FACTURA ELECTRONICA'
            sunatMessage = `Autorizado mediante resolucion N° 0180050001442/SUNAT Representacion impresa de la FACTURA ELECTRONICA`
            break
        case InvoiceCode.BOLETA:
            invoiceTitle = 'BOLETA DE VENTA ELECTRONICA'
            sunatMessage = `Autorizado mediante resolucion N° 0180050001442/SUNAT Representacion impresa de la BOLETA DE VENTA ELECTRONICA`
            break
        default:
            invoiceTitle = 'NOTA DE VENTA'
            sunatMessage = ''
            break
    }

    let plusHeigth: number = 0

    if (sale.saleItems.length > 5) {
        plusHeigth += sale.saleItems.length * 7
    }

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        plusHeigth += 60
    }

    if (urlLogo) {
        plusHeigth += 60
    }

    const pdf = new jsPDF('p', 'mm', [130 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3

    if (urlLogo) {
        positionY += 42
        pdf.addImage(urlLogo, "JPEG", 15, 0, 40, 40)
    }

    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 68 - marginLeft)
    pdf.text(strArr, pageCenter, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 3 * strArr.length
    positionY += strArr.length

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = (business.name || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    text = `RUC: ${business.ruc}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    positionY += 3

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = office.address
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += strArr.length
    }

    if (setting.textService) {
        text = setting.textService
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += strArr.length
    }

    pdf.text(invoiceTitle, pageCenter, positionY, { align: 'center' })
    positionY += 3
    text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 5

    text = `Fecha`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `: ${formatDate(sale.createdAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 18 + marginLeft, positionY)
    positionY += 3

    if (sale?.invoiceCode === InvoiceCode.NOTA_DE_VENTA) {
        if (customer !== null) {
            text = `Cliente`
            pdf.text(text, 0 + marginLeft, positionY)
            text = customer?.name || ''
            strArr = pdf.splitTextToSize(text, 70)
            pdf.text(':', 18 + marginLeft, positionY)
        }
    } else {
        text = `Cliente`
        pdf.text(text, 0 + marginLeft, positionY)
        text = customer?.name || ''
        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(':', 18 + marginLeft, positionY)
    }

    if (customer) {
        positionY += 3
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
    } else {
        if (sale?.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
            pdf.text('VARIOS', 20 + marginLeft, positionY)
            positionY += 3
        }
    }

    if (customer?.address) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        pdf.text(':', 18 + marginLeft, positionY)
        text = `${customer?.address || ''}`
        positionY += 3

        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += (2.5 * strArr.length) + strArr.length
    }

    if (customer?.document) {
        text = `RUC/DNI`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.document || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (customer?.phone) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.phone || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (sale?.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = `F. de pago`
        pdf.text(text, 0 + marginLeft, positionY)
        text = sale.isCredit ? ': CREDITO' : ': CONTADO'
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (sale.isCredit) {
        pdf.text('F. de venc.', 0 + marginLeft, positionY)
        pdf.text(`: ${formatDate(sale.dues[0]?.dueAt, 'dd/MM/yyyy', 'en-US')}`, 18 + marginLeft, positionY)

        positionY += 3

        pdf.text('Cuotas', 0, positionY)
        pdf.text(`: ${sale.dues.length} cuotas`, 18 + marginLeft, positionY)

        positionY += 3
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cantidad', 0 + marginLeft, positionY)
    pdf.text('P. Unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const saleItem of saleItems) {
        strArr = pdf.splitTextToSize(`${saleItem.fullName.toUpperCase()}${saleItem.observation ? ' - ' + saleItem.observation : ''}`, 70 - marginRight)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += (3 * strArr.length) + (strArr.length / 2)
        pdf.text(`${saleItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 0 + marginLeft, positionY)
        pdf.text((saleItem.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), pageCenter, positionY, { align: 'center' })
        pdf.text((saleItem.price * saleItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 70 - marginRight, positionY, { align: 'right' })
        positionY += 4
    }

    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    positionY += 2

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {

        if (sale.gravado) {
            text = `OP. GRAVADAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.gravado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.gratuito) {
            text = `OP. GRATUITAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.gratuito || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.exonerado) {
            text = `OP. EXONERADAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.exonerado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.inafecto) {
            text = `OP. INAFECTAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.inafecto || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        text = `IGV(${sale.igvPercent}%) ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.igv || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4

        if (sale.rcPercent) {
            text = `RC(${sale.rcPercent}%) ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.rc || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }
    }

    if (sale.discount) {
        text = `TOTAL DCTO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.discount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `IMPORTE TOTAL ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (sale.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    for (const payment of payments) {
        const foundPaymentMethod = paymentMethods.find(e => e.id === payment.paymentMethodId)
        if (foundPaymentMethod) {
            text = `${foundPaymentMethod.name} ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = payment.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }
    }

    if (sale.cash) {
        text = `BILLETE ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (sale.cash) {
        text = `VUELTO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = ((sale.cash || 0) - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (sale.isCredit) {
        text = `SALDO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.charge - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `SON: ${sale.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 68 - marginLeft)
    pdf.text(strArr, pageCenter, positionY, { align: 'center' })
    positionY += (3 * strArr.length) + strArr.length

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        const qrcode = await getQRDataUrl(sale, business, office)
        pdf.addImage(qrcode, "JPEG", 24, positionY - 1, 20, 20)
        positionY += 24
    }

    if (sunatMessage) {
        text = sunatMessage
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 11
    }

    if (banks.length) {
        for (const bank of banks) {
            pdf.setFont('Helvetica', 'bold')
            text = `${bank.name} ${bank.currencyName}`
            pdf.text(text, pageCenter, positionY, { align: 'center' })
            pdf.setFont('Helvetica', 'normal')
            positionY += 3
            text = `CUENTA: ${bank.accountNumber}`
            pdf.text(text, pageCenter, positionY, { align: 'center' })
            positionY += 3
            text = `CCI: ${bank.cci}`
            pdf.text(text, pageCenter, positionY, { align: 'center' })
            positionY += 3
        }
        positionY += 2
    }

    text = `Usuario: ${user.name}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    positionY += 4

    if (sale.board && sale.board.table) {
        text = `Mesa: ${sale.board.table.name}`
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (sale.observation) {
        text = sale.observation
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4 * strArr.length
    }

    if (setting.textBottom) {
        text = setting.textBottom
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

   // if (setting.isAttentionTicket) {
   //     pdf.addPage()
   //     pdf.setFont('Helvetica', 'bold')
   //     pdf.setFontSize(header)
   //     let text: string = ''
   //     let strArr: string[] = []
   //     let positionY: number = 5
   //     const pageCenter = 35
   //     text = 'TICKET DE ATENCION'
   //     pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
   //     text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
   //     positionY += 4
   //     pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
   //     pdf.setFont('Helvetica', 'normal')
   //     pdf.setFontSize(body)
   //     positionY += 4

   //     pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
   //     positionY += 5
   //     pdf.text('Cant.', 0 + marginLeft, positionY)
   //     pdf.text('P. unitario', pageCenter + marginLeft, positionY, { align: 'center' })
   //     pdf.text('Importe', 70, positionY, { align: 'right' })
   //     positionY += 4

   //     for (const saleItem of saleItems) {
   //         strArr = pdf.splitTextToSize(`${saleItem.fullName.toUpperCase()}${saleItem.observation ? ' - ' + saleItem.observation : ''}`, 65)
   //         pdf.text(strArr, 0 + marginLeft, positionY)
   //         positionY += 4 * strArr.length
   //         pdf.text(`${saleItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 0 + marginLeft, positionY)
   //         pdf.text((saleItem.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), pageCenter, positionY, { align: 'center' })
   //         pdf.text((saleItem.price * saleItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 70, positionY, { align: 'right' })
   //         positionY += 4
   //     }
   // }

    return pdf
}

async function getQRDataUrl(sale: SaleModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${sale.invoiceName}|${sale.invoicePrefix}${office.serialPrefix}|${sale.invoiceNumber}|${sale.igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${sale.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${sale.createdAt}`, { margin: 0 })
}
