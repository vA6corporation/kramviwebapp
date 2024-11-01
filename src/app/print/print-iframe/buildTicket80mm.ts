import { formatDate } from "@angular/common";
import * as QRCode from 'qrcode';
import jsPDF from "jspdf";
import { SaleModel } from "../../sales/sale.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";
import { BankModel } from "../../providers/bank.model";
import { PaymentMethodModel } from "../../payment-methods/payment-method.model";

export async function buildTicket80mm(
    sale: SaleModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[],
    paymentMethods: PaymentMethodModel[]
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const pageCenter = 35
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { saleItems, customer, user, payments, worker, referred } = sale

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

    let plusHeigth: number = 0

    if (sale.saleItems.length > 5) {
        plusHeigth += sale.saleItems.length * 7
    }

    if (sale.invoiceType !== 'NOTA DE VENTA') {
        plusHeigth += 60
    }

    if (setting.logo) {
        plusHeigth += 60
    }

    const pdf = new jsPDF('p', 'mm', [130 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3
    if (setting.logo) {
        positionY += 40
        pdf.addImage(setting.logo, "JPEG", 15 + marginLeft, 0, 40, 40)
    }
    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 68 - marginLeft)
    pdf.text(strArr, pageCenter, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 3 * strArr.length
    positionY += strArr.length

    if (sale.invoiceType !== 'NOTA DE VENTA') {
        text = (business.businessName || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    text = `RUC: ${business.ruc}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    positionY += 3

    if (sale.invoiceType !== 'NOTA DE VENTA' || setting.showAddressOnTicket) {
        text = office.address
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += strArr.length
    }

    if (setting.descriptionService) {
        text = setting.descriptionService
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += strArr.length
    }

    if (office.mobileNumber) {
        text = office.mobileNumber
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 3
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
    text = `: ${formatDate(sale.emitionAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 18 + marginLeft, positionY)
    positionY += 3

    if (sale?.invoiceType === 'NOTA DE VENTA') {
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
        if (sale?.invoiceType !== 'NOTA DE VENTA') {
            pdf.text('VARIOS', 20 + marginLeft, positionY)
            positionY += 3
        }
    }

    if (customer?.addresses[sale.addressIndex]) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        pdf.text(':', 18 + marginLeft, positionY)
        text = `${customer?.addresses[sale.addressIndex] || ''}`
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

    if (customer?.mobileNumber) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.mobileNumber || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (sale?.invoiceType !== 'NOTA DE VENTA') {
        text = `F. de pago`
        pdf.text(text, 0 + marginLeft, positionY)
        text = sale.isCredit ? ': CREDITO' : ': CONTADO'
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (sale.isCredit) {
        pdf.text('F. de venc.', 0 + marginLeft, positionY)
        pdf.text(`: ${formatDate(sale.dues[0]?.dueDate, 'dd/MM/yyyy', 'en-US')}`, 18 + marginLeft, positionY)

        positionY += 3

        pdf.text('Cuotas', 0, positionY)
        pdf.text(`: ${sale.dues.length} cuotas`, 18 + marginLeft, positionY)

        positionY += 3
    }

    if (sale.deliveryAt) {
        pdf.text('F. de entrega', 0 + marginLeft, positionY)
        pdf.text(`: ${formatDate(sale.deliveryAt, 'dd/MM/yyyy', 'en-US')}`, 18 + marginLeft, positionY)

        positionY += 3
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cantidad', 0 + marginLeft, positionY)
    pdf.text('P. Unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const saleItem of saleItems) {
        strArr = pdf.splitTextToSize(`${saleItem.fullName.toUpperCase()}${saleItem.observations ? ' - ' + saleItem.observations : ''}`, 70 - marginRight)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += (3 * strArr.length) + (strArr.length / 2)
        pdf.text(`${saleItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
        pdf.text((saleItem.price).toFixed(2), pageCenter, positionY, { align: 'center' })
        pdf.text((saleItem.price * saleItem.quantity).toFixed(2), 70 - marginRight, positionY, { align: 'right' })
        positionY += 4
    }

    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    positionY += 2

    if (sale.invoiceType !== 'NOTA DE VENTA' && !setting.hideIgvTicket) {

        if (sale.gravado) {
            text = `OP. GRAVADAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.gravado || 0).toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.gratuito) {
            text = `OP. GRATUITAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.gratuito || 0).toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.exonerado) {
            text = `OP. EXONERADAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.exonerado || 0).toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        if (sale.inafecto) {
            text = `OP. INAFECTAS ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.inafecto || 0).toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }

        text = `IGV(${sale.igvPercent}%) ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.igv || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4

        if (sale.rcPercent) {
            text = `RC(${sale.rcPercent}%) ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = (sale.rc || 0).toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }
    }

    if (sale.discount) {
        text = `TOTAL DCTO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.discount || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `IMPORTE TOTAL ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (sale.charge || 0).toFixed(2)
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    for (const payment of payments) {
        const foundPaymentMethod = paymentMethods.find(e => e._id === payment.paymentMethodId)
        if (foundPaymentMethod) {
            text = `${foundPaymentMethod.name} ${currency}`
            pdf.text(text, 45, positionY, { align: 'right' })
            text = payment.charge.toFixed(2)
            pdf.text(text, 60, positionY, { align: 'right' })
            positionY += 4
        }
    }

    if (sale.cash) {
        text = `BILLETE ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.cash || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (sale.cash) {
        text = `VUELTO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = ((sale.cash || 0) - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (sale.isCredit) {
        text = `SALDO ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (sale.charge - payments.map(e => e.charge).reduce((a, b) => a + b, 0)).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `SON: ${sale.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 68 - marginLeft)
    pdf.text(strArr, pageCenter, positionY, { align: 'center' })
    positionY += (3 * strArr.length) + strArr.length

    if (sale.invoiceType !== 'NOTA DE VENTA' || setting.showQrOnTicket) {
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
            text = `${bank.bankName} ${bank.currencyName}`
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

    if (worker) {
        text = `Personal: ${worker.name}`
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (sale.board && sale.board.table) {
        text = `Mesa: ${sale.board.table.name}`
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (referred) {
        text = `Referido: ${referred.name}`
        pdf.text(text, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (sale.observations) {
        text = sale.observations
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4 * strArr.length
    }

    if (setting.textSale) {
        text = setting.textSale
        strArr = pdf.splitTextToSize(text, 68 - marginLeft)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    if (setting.isAttentionTicket) {
        pdf.addPage()
        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(header)
        let text: string = ''
        let strArr: string[] = []
        let positionY: number = 5
        const pageCenter = 35
        text = 'TICKET DE ATENCION'
        pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
        pdf.setFont('Helvetica', 'normal')
        pdf.setFontSize(body)
        positionY += 4

        pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
        positionY += 5
        pdf.text('Cant.', 0 + marginLeft, positionY)
        pdf.text('P. unitario', pageCenter + marginLeft, positionY, { align: 'center' })
        pdf.text('Importe', 70, positionY, { align: 'right' })
        positionY += 4

        for (const saleItem of saleItems) {
            strArr = pdf.splitTextToSize(`${saleItem.fullName.toUpperCase()}${saleItem.observations ? ' - ' + saleItem.observations : ''}`, 65)
            pdf.text(strArr, 0 + marginLeft, positionY)
            positionY += 4 * strArr.length
            pdf.text(`${saleItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
            pdf.text((saleItem.price).toFixed(2), pageCenter, positionY, { align: 'center' })
            pdf.text((saleItem.price * saleItem.quantity).toFixed(2), 70, positionY, { align: 'right' })
            positionY += 4
        }
    }

    return pdf
}

async function getQRDataUrl(sale: SaleModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${sale.invoiceType}|${sale.invoicePrefix}${office.serialPrefix}|${sale.invoiceNumber}|${sale.igv.toFixed(2)}|${sale.charge.toFixed(2)}|${sale.emitionAt}`, { margin: 0 })
}