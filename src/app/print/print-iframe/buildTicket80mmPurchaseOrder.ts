import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { PurchaseOrderModel } from "../../purchase-orders/purchase-order.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildTicket80mmPurchaseOrder(
    purchaseOrder: PurchaseOrderModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { purchaseOrderItems, provider, user } = purchaseOrder

    let plusHeigth: number = 0

    if (purchaseOrder.purchaseOrderItems.length > 5) {
        plusHeigth += purchaseOrder.purchaseOrderItems.length * 7
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
    const pageCenter = 35
    if (setting.logo) {
        positionY += 40
        pdf.addImage(setting.logo, "JPEG", 15 + marginLeft, 0, 40, 40)
    }
    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 3 * strArr.length
    positionY += 1

    text = (business.businessName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3 * strArr.length

    text = `RUC: ${business.ruc}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3

    text = office.address
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 3 * strArr.length
    positionY += 2

    if (setting.descriptionService) {
        text = setting.descriptionService
        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3 * strArr.length
        positionY += 2
    }

    if (office.mobileNumber) {
        text = office.mobileNumber
        pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 3
    }

    text = `OC${office?.serialPrefix}-${purchaseOrder?.purchaseOrderNumber}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    text = `Fecha`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `: ${formatDate(purchaseOrder.createdAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 18 + marginLeft, positionY)
    positionY += 3

    text = `Proveedor`
    pdf.text(text, 0 + marginLeft, positionY)
    text = provider?.name || 'NINGUNO'
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(':', 18 + marginLeft, positionY)

    if (provider) {
        positionY += 3
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
    }

    if (provider?.address) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        pdf.text(':', 18 + marginLeft, positionY)
        text = `${provider?.address || ''}`
        positionY += 3

        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += (3 * strArr.length) + 1
    }

    if (provider?.document) {
        text = `RUC/DNI`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${provider?.document || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    if (provider?.mobileNumber) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${provider?.mobileNumber || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 3
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cantidad', 0 + marginLeft, positionY)
    pdf.text('P. Unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const purchaseOrderItem of purchaseOrderItems) {
        strArr = pdf.splitTextToSize(`${purchaseOrderItem.fullName.toUpperCase()}${purchaseOrderItem.observations ? ' - ' + purchaseOrderItem.observations : ''}`, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 3 * strArr.length
        pdf.text(`${purchaseOrderItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
        pdf.text((purchaseOrderItem.cost).toFixed(2), pageCenter, positionY, { align: 'center' })
        pdf.text((purchaseOrderItem.cost * purchaseOrderItem.quantity).toFixed(2), 70 - marginRight, positionY, { align: 'right' })
        positionY += 4
    }

    const currency = purchaseOrder.currencyCode === 'PEN' ? 'S/' : '$'

    positionY += 2

    if (purchaseOrder.gravado) {
        text = `OP. GRAVADAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (purchaseOrder.gravado || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (purchaseOrder.gratuito) {
        text = `OP. GRATUITAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (purchaseOrder.gratuito || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (purchaseOrder.exonerado) {
        text = `OP. EXONERADAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (purchaseOrder.exonerado || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    if (purchaseOrder.inafecto) {
        text = `OP. INAFECTAS ${currency}`
        pdf.text(text, 45, positionY, { align: 'right' })
        text = (purchaseOrder.inafecto || 0).toFixed(2)
        pdf.text(text, 60, positionY, { align: 'right' })
        positionY += 4
    }

    text = `IGV(18%) ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (purchaseOrder.igv || 0).toFixed(2)
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    text = `IMPORTE TOTAL ${currency}`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (purchaseOrder.charge || 0).toFixed(2)
    pdf.text(text, 60, positionY, { align: 'right' })
    positionY += 4

    text = `SON: ${purchaseOrder.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    text = `Usuario: ${user.name}`
    pdf.text(text, pageCenter, positionY, { align: 'center' })
    positionY += 4

    if (purchaseOrder.observations) {
        text = purchaseOrder.observations
        strArr = pdf.splitTextToSize(text, 68)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4 * strArr.length
    }

    if (setting.textSale) {
        text = setting.textSale
        strArr = pdf.splitTextToSize(text, 68)
        pdf.text(strArr, pageCenter, positionY, { align: 'center' })
        positionY += 4
    }

    return pdf
}