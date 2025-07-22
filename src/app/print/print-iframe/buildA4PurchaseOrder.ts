import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import * as QRCode from 'qrcode';
import { PurchaseOrderModel } from "../../purchase-orders/purchase-order.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA4PurchaseOrder(
    purchaseOrder: PurchaseOrderModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const title = 11
    const header = 10
    const body = 8
    let pages = 0
    const { purchaseOrderItems, provider, user } = purchaseOrder

    const pdf = new jsPDF('p', 'mm', [297, 210])
    let text: string = ''
    let strArr: string[] = []
    const pageHeight = pdf.internal.pageSize.height
    if (setting.logo) {
        pdf.addImage(setting.logo, "JPEG", 5, 5, 35, 35)
    }

    let positionYTitle = 10

    if (setting.header) {
        pdf.addImage(setting.header, "JPEG", 40, 5, 100, 15)
        positionYTitle += 15
    } else {
        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(title)
        text = (office.tradeName || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle, { align: 'center' })
        positionYTitle += 3 * strArr.length

        if (office.tradeName !== business.businessName) {
            positionYTitle += 1
            pdf.setFont('Helvetica', 'normal')
            pdf.setFontSize(body)
            text = (business.businessName || '').toUpperCase()
            strArr = pdf.splitTextToSize(text, 95)
            pdf.text(strArr, 90, positionYTitle, { align: 'center' })
            positionYTitle += 3 * strArr.length
        }
    }

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    if (setting.descriptionService) {
        text = setting.descriptionService
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle, { align: 'center' })
        positionYTitle += 3 * strArr.length
    }

    text = office.address
    strArr = pdf.splitTextToSize(text, 95)
    pdf.text(strArr, 90, positionYTitle, { align: 'center' })
    positionYTitle += 3 * strArr.length

    if (office.mobileNumber) {
        text = office.mobileNumber
        pdf.text(text, 90, positionYTitle, { align: 'center' })
        positionYTitle += 3
    }

    if (setting.textHeader) {
        pdf.setDrawColor(0)
        pdf.setFillColor(0, 0, 0)
        pdf.roundedRect(43, positionYTitle - 1.8, 95, 4, 1, 1, 'FD')

        text = setting.textHeader
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('Helvetica', 'bold')
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle + 1, { align: 'center' })
        pdf.setTextColor(0, 0, 0)
        pdf.setFont('Helvetica', 'normal')
        positionYTitle += 3 * strArr.length
    }

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(141, 5, 64, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 168, 15, { align: 'center' })

    text = 'ORDEN DE COMPRA'
    pdf.text(text, 168, 24, { align: 'center' })

    text = `OC${office?.serialPrefix}-${purchaseOrder?.purchaseOrderNumber}`
    pdf.text(text, 168, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (provider?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (provider?.address || '').toUpperCase()
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
    text = (provider?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, 50)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('RUC', 8, positionYCustomer)
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
    pdf.text('OBSER.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (purchaseOrder.observations || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 160)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('F/H EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)
    pdf.text('FECHA VENCIMIENTO', 130, 55)
    pdf.text(':', 165, 55)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(purchaseOrder.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 170, 50)

    text = `${formatDate(purchaseOrder.createdAt, 'dd/MM/yyyy', 'en-US')}`
    pdf.text(text, 170, 55)

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

    for (const purchaseOrderItem of purchaseOrderItems || []) {
        text = purchaseOrderItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 7, positionYitems)

        text = (purchaseOrderItem.sku || '').toString()
        pdf.text(text, 23, positionYitems)

        text = purchaseOrderItem.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 75)
        pdf.text(strArr, 47, positionYitems)

        text = purchaseOrderItem.unitCode
        pdf.text(text, 142, positionYitems)

        text = purchaseOrderItem.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 163, positionYitems)

        text = (purchaseOrderItem.cost * purchaseOrderItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 183, positionYitems)

        positionYitems += 5 * strArr.length
    }

    if (positionYitems >= pageHeight - 50) {
        pdf.addPage()
        positionYitems = 5
    }

    pdf.line(5, positionYitems, 205, positionYitems)

    positionYitems += 5

    if (purchaseOrder && business && office) {
        const qrcode = await getQRDataUrl(purchaseOrder, business, office)
        pdf.addImage(qrcode, "JPEG", 5, positionYitems, 35, 35)
    }

    text = `SON: ${purchaseOrder?.chargeLetters}`
    pdf.text(text, 45, positionYitems + 4)

    text = `${setting.textSale}`
    pdf.text(text, 45, positionYitems + 12)

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

    text = 'IMPORTE TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 5

    pdf.setFont('Helvetica', 'normal')

    const currency = purchaseOrder.currencyCode === 'PEN' ? 'S/' : '$'

    text = (0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = ((purchaseOrder?.charge || 0) - (purchaseOrder?.igv || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.gravado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.exonerado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.inafecto || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.gratuito || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.igv || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (purchaseOrder?.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    return pdf
}

async function getQRDataUrl(purchaseOrder: PurchaseOrderModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|OC${office.serialPrefix}|${purchaseOrder.purchaseOrderNumber}|${purchaseOrder.igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${purchaseOrder.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${purchaseOrder.createdAt}`, { margin: 0 });
}