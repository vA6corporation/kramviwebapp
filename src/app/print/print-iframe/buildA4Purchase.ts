import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { PurchaseModel } from "../../purchases/purchase.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA4Purchase(
    purchase: PurchaseModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const { purchaseItems, provider, user } = purchase

    let invoiceTitle = 'COMPRA'
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

    text = `${office?.address.toLowerCase()}`
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    text = office?.mobileNumber || ''
    pdf.text(text, 45, positionYTitle)
    positionYTitle += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(140, 5, 65, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 171, 15, { align: 'center' })

    text = invoiceTitle || ''
    pdf.text(text, 171, 24, { align: 'center' })

    text = purchase?.serie || 'SIN SERIE'
    pdf.text(text, 171, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (provider?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (provider?.address || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    let positionYCustomer = 51

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SEÑOR(es)', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (provider?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, 50)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    text = provider?.documentType || 'RUC'
    pdf.text(text, 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = provider?.document || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('DIRECCIÓN', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (provider?.address || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('CELULAR', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = provider?.mobileNumber || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    if (provider?.email) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('EMAIL', 8, positionYCustomer)
        pdf.text(':', 30, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = provider?.email || ''
        pdf.text(text, 35, positionYCustomer)

        positionYCustomer += 5
        plusHeight += 5
    }

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, 45, 200, 20 + plusHeight, 1, 1, 'S')

    pdf.setFont('Helvetica', 'bold')
    pdf.text('OBSER.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (purchase.observations || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 160)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('F/H EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(purchase.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 170, 50)

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(20, positionYColumns, 20, positionYColumns + 7)
    pdf.line(45, positionYColumns, 45, positionYColumns + 7)
    pdf.line(160, positionYColumns, 160, positionYColumns + 7)
    pdf.line(180, positionYColumns, 180, positionYColumns + 7)

    text = 'Cant.'
    pdf.text(text, 7, positionYColumns + 5)

    text = 'Codigo'
    pdf.text(text, 22, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 47, positionYColumns + 5)

    text = 'Valor Unit.'
    pdf.text(text, 163, positionYColumns + 5)

    text = 'Sub. Total'
    pdf.text(text, 183, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 10

    for (const purchaseItem of purchaseItems || []) {
        text = purchaseItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 7, positionYitems)

        text = (purchaseItem.sku || '').toString()
        pdf.text(text, 23, positionYitems)

        text = purchaseItem.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 85)
        pdf.text(strArr, 47, positionYitems)

        text = purchaseItem.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 163, positionYitems)

        text = (purchaseItem.cost * purchaseItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 183, positionYitems)

        positionYitems += 5 * strArr.length

    }

    if (positionYitems >= pageHeight - 50) {
        pdf.addPage()
        positionYitems = 5
    }

    pdf.line(5, positionYitems, 205, positionYitems)

    positionYitems += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(140, positionYitems, 65, 43, 1, 1, 'FD')

    let positionYSummary = positionYitems
    let positionYSummaryRight = positionYitems

    positionYSummary += 5
    positionYSummaryRight += 5
    pdf.setFont('Helvetica', 'bold')

    if (purchase.invoiceType !== 'NOTA DE VENTA') {
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

    const currency = purchase.currencyCode === 'PEN' ? 'S/' : '$'

    text = ((purchase?.charge || 0) - (purchase?.igv || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.gravado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.exonerado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.inafecto || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.gratuito || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.igv || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchase?.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    return pdf
}