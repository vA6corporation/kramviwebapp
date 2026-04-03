import { formatDate } from '@angular/common'
import * as QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { CreditNoteModel } from '../../credit-notes/credit-note.model'
import { SettingModel } from '../../settings/setting.model'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { InvoiceCode } from '../../sales/invoice-code.enum'

export async function buildTicket80mmCreditNote(
    creditNote: CreditNoteModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { creditNoteItems, customer, user } = creditNote

    let invoiceTitle = 'NOTA DE CREDITO ELECTRONICA'

    let plusHeigth: number = 0

    if (creditNote.creditNoteItems.length > 5) {
        plusHeigth += creditNote.creditNoteItems.length * 7
    }

   // if (setting.logo) {
   //     plusHeigth += 60
   // }

    const pdf = new jsPDF('p', 'mm', [130 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3
    const pageCenter = 35

   // if (setting.logo) {
   //     positionY += 40
   //     pdf.addImage(setting.logo, "JPEG", 15 + marginLeft, 0, 40, 40)
   // }

    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 3 * strArr.length
    positionY += 1

    if (creditNote.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = (business.name || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
    }

    text = `RUC: ${business.ruc}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3

    text = office.address
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3 * strArr.length
    positionY += 2

    if (setting.textService) {
        text = setting.textService
        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += 2
    }

    if (office.phone) {
        text = office.phone
        pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3
    }

    positionY += 2

    pdf.text(invoiceTitle, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3
    text = `${creditNote.invoicePrefix}${office.serialPrefix}-${creditNote.invoiceNumber}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 5

    text = `Fecha`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `: ${formatDate(creditNote.createdAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 18 + marginLeft, positionY)
    positionY += 3

    if (customer) {
        text = `Cliente`
        pdf.text(text, 0 + marginLeft, positionY)
        text = customer.name || ''
        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(':', 18 + marginLeft, positionY)
        positionY += 3
        pdf.text(strArr, marginLeft, positionY)
        positionY += 3 * strArr.length
    } else {
        pdf.text('VARIOS', 20 + marginLeft, positionY)
        positionY += 3
    }

    if (customer && customer.address) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        pdf.text(':', 18 + marginLeft, positionY)
        text = customer.address
        positionY += 3

        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 1
        positionY += 3 * strArr.length
    }

    if (customer && customer.document) {
        text = `RUC/DNI`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer.document || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (customer && customer.phone) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer.phone || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cantidad', 0 + marginLeft, positionY)
    pdf.text('P. Unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const creditNoteItem of creditNoteItems) {
        strArr = pdf.splitTextToSize(`${creditNoteItem.fullName.toUpperCase()}${creditNoteItem.observation ? ' - ' + creditNoteItem.observation : ''}`, 65)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
        pdf.text(`${creditNoteItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 0 + marginLeft, positionY)
        pdf.text((creditNoteItem.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), pageCenter, positionY, { align: 'center' })
        pdf.text((creditNoteItem.price * creditNoteItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 70 - marginRight, positionY, { align: 'right' })
        positionY += 4
    }

    const currency = creditNote.currencyCode === 'PEN' ? 'S/' : '$'

    positionY += 2

    if (creditNote.gravado) {
        text = `OP. GRAVADAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (creditNote.gravado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (creditNote.gratuito) {
        text = `OP. GRATUITAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (creditNote.gratuito || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (creditNote.exonerado) {
        text = `OP. EXONERADAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (creditNote.exonerado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (creditNote.inafecto) {
        text = `OP. INAFECTAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (creditNote.inafecto || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `IGV(18%) ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (creditNote.igv || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    text = `IMPORTE TOTAL ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (creditNote.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    text = `SON: ${creditNote.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    const qrcode = await getQRDataUrl(creditNote, business, office)
    pdf.addImage(qrcode, "JPEG", 23, positionY, 25, 25)
    positionY += 30

    return pdf
}

async function getQRDataUrl(creditNote: CreditNoteModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${creditNote.invoiceName}|${creditNote.invoicePrefix}${office.serialPrefix}|${creditNote.invoiceNumber}|${creditNote.igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${creditNote.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${creditNote.createdAt}`, { margin: 0 })
}
