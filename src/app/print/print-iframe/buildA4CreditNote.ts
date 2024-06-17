import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import * as QRCode from 'qrcode';
import { CreditNoteModel } from "../../credit-notes/credit-note.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA4CreditNote(
    creditNote: CreditNoteModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const { creditNoteItems, customer, user, worker, sale } = creditNote

    let invoiceTitle = 'NOTA DE CREDITO ELECTRONICA'

    const pdf = new jsPDF('p', 'mm', [297, 210])
    let text: string = ''
    let strArr: string[] = []
    const pageHeight = pdf.internal.pageSize.height

    if (setting?.logo) {
        pdf.addImage(setting.logo, "JPEG", 5, 5, 35, 35)
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

    if (setting.descriptionService) {
        text = setting.descriptionService || ''
        strArr = pdf.splitTextToSize(text, 90)
        pdf.text(strArr, 45, positionYTitle)
        positionYTitle += 4 * strArr.length
    }

    text = office?.address
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    text = office?.mobileNumber || ''
    pdf.text(text, 45, positionYTitle)
    positionYTitle += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(139, 5, 66, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 172, 15, { align: 'center' })

    text = invoiceTitle || ''
    pdf.text(text, 172, 24, { align: 'center' })

    text = `${creditNote?.invoicePrefix}${office?.serialPrefix}-${creditNote?.invoiceNumber}`
    pdf.text(text, 172, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (customer?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (customer?.addresses[0] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, 45, 200, 15 + plusHeight, 1, 1, 'FD')

    let positionYCustomer = 51

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SEÑOR(es)', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, 50)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('RUC', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = customer?.document || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('DIRECCIÓN', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.addresses[0] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SUSTENTO', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')

    text = creditNote.reasonDescription
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA EMISIÓN', 120, 50)
    pdf.text(':', 155, 50)
    pdf.text('HORA EMISIÓN', 120, 55)
    pdf.text(':', 155, 55)
    pdf.text('COMPROBANTE', 120, 60)
    pdf.text(':', 155, 60)
    pdf.text('OBSERVACIONES', 120, 65)
    pdf.text(':', 155, 65)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(creditNote?.emitionAt || '', 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 160, 50)

    text = `${formatDate(creditNote?.emitionAt || '', 'h:mm a', 'en-US')}`
    pdf.text(text, 160, 55)

    text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
    pdf.text(text, 160, 60)

    text = creditNote?.observations || 'NINGUNO'
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 160, 65)

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(20, positionYColumns, 20, positionYColumns + 7)
    pdf.line(45, positionYColumns, 45, positionYColumns + 7)
    pdf.line(140, positionYColumns, 140, positionYColumns + 7)
    pdf.line(160, positionYColumns, 160, positionYColumns + 7)
    pdf.line(180, positionYColumns, 180, positionYColumns + 7)

    text = 'Cant.'
    pdf.text(text, 7, positionYColumns + 5)

    text = 'Codigo'
    pdf.text(text, 22, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 47, positionYColumns + 5)

    text = 'Unidad'
    pdf.text(text, 142, positionYColumns + 5)

    text = 'Pre. Unit'
    pdf.text(text, 163, positionYColumns + 5)

    text = 'Sub. Total'
    pdf.text(text, 183, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 10

    for (const creditNoteItem of creditNoteItems || []) {
        text = creditNoteItem.quantity.toFixed(2)
        pdf.text(text, 7, positionYitems)

        text = (creditNoteItem.sku || '').toString()
        pdf.text(text, 23, positionYitems)

        text = creditNoteItem.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 90)
        pdf.text(strArr, 47, positionYitems)

        text = creditNoteItem.unitCode
        pdf.text(text, 142, positionYitems)

        text = creditNoteItem.price.toFixed(2)
        pdf.text(text, 163, positionYitems)

        text = (creditNoteItem.price * creditNoteItem.quantity).toFixed(2)
        pdf.text(text, 183, positionYitems)

        positionYitems += 5 * strArr.length

        if (creditNoteItem.observations) {
            text = `S/N: ${creditNoteItem.observations}`
            strArr = pdf.splitTextToSize(text, 90)
            pdf.text(strArr, 47, positionYitems)

            positionYitems += 5 * strArr.length
        }

        if (positionYitems >= pageHeight - 55) {
            pdf.addPage()
            positionYitems = 5
        }

    }

    pdf.line(5, positionYitems, 205, positionYitems)

    positionYitems += 5

    text = `SON: ${sale.chargeLetters}`
    pdf.text(text, 5, positionYitems)

    if (worker) {
        text = `Personal: ${worker.name.toUpperCase()} - Usuario: ${user.name.toUpperCase()}`
        pdf.text(text, 205, positionYitems, { align: 'right' })
    } else {
        text = `Usuario: ${user.name.toUpperCase()}`
        pdf.text(text, 205, positionYitems, { align: 'right' })
    }

    positionYitems += 3

    if (creditNote && business && office) {
        const qrcode = await getQRDataUrl(creditNote, business, office)
        pdf.addImage(qrcode, "JPEG", 5, positionYitems, 35, 35)
    }

    text = `${setting.textSale}`
    pdf.text(text, 45, positionYitems + 2)

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(140, positionYitems, 65, 43, 1, 1, 'FD')

    let positionYSummary = positionYitems
    let positionYSummaryRight = positionYitems

    positionYSummary += 5
    positionYSummaryRight += 5
    pdf.setFont('Helvetica', 'bold')

    text = 'DSCTO GLOBAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 5

    if (creditNote.invoiceType !== 'NOTA DE VENTA') {
        text = 'SUB TOTAL'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5

        text = 'OP. GRAVADO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5

        text = 'OP. EXONERADO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5

        text = 'OP. INAFECTO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5

        text = 'OP. GRATUITO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5

        text = 'I.G.V. 18%'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 5
    }

    text = 'IMPORTE TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 5

    pdf.setFont('Helvetica', 'normal')

    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    text = '0.00'
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    if (creditNote.invoiceType !== 'NOTA DE VENTA') {
        text = ((creditNote?.charge || 0) - (creditNote?.igv || 0)).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5

        text = (creditNote?.gravado || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5

        text = (creditNote?.exonerado || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5

        text = (creditNote?.inafecto || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5

        text = (creditNote?.gratuito || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5

        text = (creditNote?.igv || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 5
    }

    text = (creditNote?.charge || 0).toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    return pdf
}

async function getQRDataUrl(creditNote: CreditNoteModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${creditNote.invoiceType.toUpperCase()}|${creditNote.invoicePrefix}${office.serialPrefix}|${creditNote.invoiceNumber}|${creditNote.igv.toFixed(2)}|${creditNote.charge.toFixed(2)}|${creditNote.createdAt}`, { margin: 0 })
}