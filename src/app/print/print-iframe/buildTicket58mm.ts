import { formatDate } from "@angular/common";
import * as QRCode from 'qrcode';
import jsPDF from "jspdf";
import { SaleModel } from "../../sales/sale.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";
import { PaymentMethodModel } from "../../payment-methods/payment-method.model";

export async function buildTicket58mm(
    sale: SaleModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    paymentMethods: PaymentMethodModel[]
): Promise<jsPDF> {
    const header = 9
    const body = 7
    const marginLeft = setting.marginLeft
    const { saleItems, customer, user, payments } = sale

    let invoiceTitle = ''
    let sunatMessage = ''

    switch (sale.invoiceType) {
        case 'FACTURA':
            invoiceTitle = 'FACTURA ELECTRONICA'
            sunatMessage = `Autorizado mediante resolucion N° 0180050001442/SUNAT Representacion impresa de la FACTURA ELECTRONICA`
            break
        case 'BOLETA':
            invoiceTitle = 'BOLETA DE VENTA ELECTRONICA'
            sunatMessage = `Autorizado mediante resolucion N° 0180050001442/SUNAT Representacion impresa de la BOLETA DE VENTA ELECTRONICA`
            break
        default:
            invoiceTitle = 'NOTA DE VENTA'
            sunatMessage = ''
            break
    }

    const pdf = new jsPDF('p', 'mm', [297, 48])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3
    const pageCenter = 23

    if (setting.logo) {
        positionY += 30
        pdf.addImage(setting.logo, "JPEG", 10 + marginLeft, 0, 30, 30)
    }

    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 50)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 3 * strArr.length
    positionY += 1

    if (sale.invoiceType !== 'NOTA DE VENTA') {
        text = (business.businessName || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 50)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    text = `RUC: ${business.ruc}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3

    if (sale.invoiceType !== 'NOTA DE VENTA' || setting.showAddressOnTicket) {
        text = office.address
        strArr = pdf.splitTextToSize(text, 50)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    if (setting.descriptionService) {
        text = setting.descriptionService
        strArr = pdf.splitTextToSize(text, 50)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    if (office.mobileNumber) {
        text = office.mobileNumber
        pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3
    }

    pdf.text(`${invoiceTitle}`, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3
    text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 4

    text = `Fecha:`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `${formatDate(sale.createdAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 15 + marginLeft, positionY)
    positionY += 3

    if (customer?.name) {
        text = `Cliente:`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 3
        text = `${customer.name || 'VARIOS'}`
        strArr = pdf.splitTextToSize(text, 50)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
    }

    if (customer?.addresses[sale.addressIndex]) {
        text = `Direccion:`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 3
        text = customer.addresses[sale.addressIndex] || ''
        strArr = pdf.splitTextToSize(text, 50)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
    }

    if (customer?.document) {
        text = `RUC/DNI:`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `${customer.document || ''}`
        pdf.text(text, 15 + marginLeft, positionY)
        positionY += 3
    }

    if (customer?.mobileNumber) {
        text = `Celular:`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `${customer.mobileNumber || ''}`
        pdf.text(text, 15 + marginLeft, positionY)
        positionY += 3
    }

    text = `F. pago:`
    pdf.text(text, 0 + marginLeft, positionY)
    text = sale.isPaid ? 'CONTADO' : 'CREDITO'
    pdf.text(text, 15 + marginLeft, positionY)
    positionY += 3

    if (sale.isCredit) {
        pdf.text('F. de venc.:', 0 + marginLeft, positionY)
        pdf.text(`${formatDate(sale.dues[0].dueDate, 'dd/MM/yyyy', 'en-US')}`, 15 + marginLeft, positionY)
        positionY += 3

        pdf.text('Cuotas:', 0, positionY)
        pdf.text(`${sale.dues.length} cuotas`, 15 + marginLeft, positionY)
        positionY += 3
    }

    if (sale.deliveryAt) {
        pdf.text('F. entrega:', 0 + marginLeft, positionY)
        pdf.text(`${formatDate(sale.deliveryAt, 'dd/MM/yyyy', 'en-US')}`, 15 + marginLeft, positionY)
        positionY += 3
    }

    pdf.line(0 + marginLeft, positionY, 47, positionY) // horizontal line
    positionY += 5

    pdf.text('Cant.', 0 + marginLeft, positionY)
    pdf.text('P. Unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Imp.', 45, positionY, { align: 'right' })
    positionY += 4

    for (const saleItem of saleItems) {
        strArr = pdf.splitTextToSize(saleItem.fullName.toUpperCase(), 47)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
        pdf.text(`${saleItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
        pdf.text(`${saleItem.price.toFixed(2)}`, 23, positionY, { align: 'center' })
        pdf.text((saleItem.price * saleItem.quantity).toFixed(2), 45, positionY, { align: 'right' })
        positionY += 3
    }

    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    positionY += 3

    if (sale.invoiceType !== 'NOTA DE VENTA') {

        if (sale.gravado) {
            text = `OP. GRAVADAS ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = (sale.gravado || 0).toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }

        if (sale.gratuito) {
            text = `OP. GRATUITAS ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = (sale.gratuito || 0).toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }

        if (sale.exonerado) {
            text = `OP. EXONERADAS ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = (sale.exonerado || 0).toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }

        if (sale.inafecto) {
            text = `OP. INAFECTAS ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = (sale.inafecto || 0).toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }

        text = `IGV(${sale.igvPercent}%) ${currency}`
        pdf.text(text, 35, positionY, { align: 'right' })
        text = (sale.igv || 0).toFixed(2)
        pdf.text(text, 45, positionY, { align: 'right' })
        positionY += 3

        if (sale.rcPercent) {
            text = `RC(${sale.rcPercent}%) ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = (sale.rc || 0).toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }
    }

    text = `TOTAL DCTO ${currency}`
    pdf.text(text, 35, positionY, { align: 'right' })
    text = (sale.discount || 0).toFixed(2)
    pdf.text(text, 45, positionY, { align: 'right' })
    positionY += 3
    text = `IMPORTE TOTAL ${currency}`
    pdf.text(text, 35, positionY, { align: 'right' })
    text = (sale.charge || 0).toFixed(2)
    pdf.text(text, 45, positionY, { align: 'right' })
    positionY += 3

    for (const payment of payments) {
        const foundPaymentMethod = paymentMethods.find(e => e._id === payment.paymentMethodId)
        if (foundPaymentMethod) {
            text = `${foundPaymentMethod.name} ${currency}`
            pdf.text(text, 35, positionY, { align: 'right' })
            text = payment.charge.toFixed(2)
            pdf.text(text, 45, positionY, { align: 'right' })
            positionY += 3
        }
    }

    if (sale.cash) {
        text = `BILLETE ${currency}`
        pdf.text(text, 35, positionY, { align: 'right' })
        text = (sale.cash || 0).toFixed(2)
        pdf.text(text, 45, positionY, { align: 'right' })
        positionY += 3
    }

    if (sale.cash) {
        text = `VUELTO ${currency}`
        pdf.text(text, 35, positionY, { align: 'right' })
        text = ((sale.cash || 0) - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toFixed(2)
        pdf.text(text, 45, positionY, { align: 'right' })
        positionY += 3
    }

    if (sale.isCredit) {
        text = `SALDO ${currency}`
        pdf.text(text, 25, positionY, { align: 'right' })
        text = (sale.charge - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toFixed(2)
        pdf.text(text, 45, positionY, { align: 'right' })
        positionY += 3
    }

    text = `SON: ${sale.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3 * strArr.length

    if (sale.invoiceType !== 'NOTA DE VENTA' || setting.showQrOnTicket) {
        const qrcode = await getQRDataUrl(sale, business, office)
        pdf.addImage(qrcode, "JPEG", 14, positionY, 18, 18)
        positionY += 23
    }

    if (sunatMessage) {
        text = sunatMessage
        strArr = pdf.splitTextToSize(text, 47)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 10
    }

    if (sale.observations) {
        text = sale.observations
        strArr = pdf.splitTextToSize(text, 47)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    text = `Usuario: ${user.name}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    positionY += 4

    if (sale.board && sale.board.table) {
        text = `Mesa ${sale.board.table.name}`
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (setting.textSale) {
        text = setting.textSale
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    return pdf
}

async function getQRDataUrl(sale: SaleModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${sale.invoiceType.toUpperCase()}|${sale.invoicePrefix}${office.serialPrefix}|${sale.invoiceNumber}|${sale.igv.toFixed(2)}|${sale.charge.toFixed(2)}|${sale.createdAt}`, { margin: 0 })
}