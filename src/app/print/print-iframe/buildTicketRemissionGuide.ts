import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { RemissionGuideModel } from "../../remission-guides/remission-guide.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildTicketRemissionGuide(
    remissionGuide: RemissionGuideModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { remissionGuideItems, customer, user, carrier } = remissionGuide

    let plusHeigth: number = 0

    if (remissionGuideItems.length > 10) {
        plusHeigth += remissionGuideItems.length * 5
    }

    const pdf = new jsPDF('p', 'mm', [297 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 5
    const pageCenter = 35
    if (setting.logo) {
        positionY += 40
        pdf.addImage(setting.logo, "JPEG", 15 + marginLeft, 0, 40, 40)
    }
    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 65)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 4 * strArr.length

    text = (business.businessName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 65)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    text = `RUC: ${business?.ruc}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    text = office.address
    strArr = pdf.splitTextToSize(text, 65)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    if (setting.descriptionService) {
        text = setting.descriptionService
        strArr = pdf.splitTextToSize(text, 65)
        pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
        positionY += 4 * strArr.length
    }

    if (office.mobileNumber) {
        pdf.text(`${office.mobileNumber}`, pageCenter + marginLeft, positionY, { align: 'center' })
        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(header)
        positionY += 6
    }

    pdf.text('GUIA DE REMISION ELECTRONICA\nREMITENTE', pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 8
    text = `T${office?.serialPrefix}-${remissionGuide?.remissionGuideNumber}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 4
    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5


    text = `Comprobante`
    pdf.text(text, 0 + marginLeft, positionY)
    if (remissionGuide.sale) {
        text = `${remissionGuide.sale.invoicePrefix}${office.serialPrefix}-${remissionGuide.sale.invoiceNumber}`
        positionY += 4
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    } else {
        text = 'NINGUNO'
        positionY += 4
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    }

    text = `F. de emision`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `${formatDate(remissionGuide.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')}`
    positionY += 4
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4

    text = `F. de traslado`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `${formatDate(remissionGuide.transportAt, 'dd/MM/yyyy, h:mm a', 'en-US')}`
    positionY += 4
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4

    text = `Cliente`
    pdf.text(text, 0 + marginLeft, positionY)

    if (customer) {
        text = customer?.name
        strArr = pdf.splitTextToSize(text, 70)
        positionY += 4
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
    } else {
        pdf.text('VARIOS', 20, positionY)
        positionY += 4
    }

    if (customer?.addresses[0]) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `${customer?.addresses[0] || ''}`
        positionY += 4

        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
    }

    if (customer?.document) {
        text = `RUC/DNI`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
        text = `${customer?.document || ''}`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    }

    if (customer?.mobileNumber) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.mobileNumber || ''}`
        pdf.text(text, 15 + marginLeft, positionY)
        positionY += 4
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5

    text = `Peso`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4
    text = `${remissionGuide.shippingWeight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4

    text = `Sustento`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4
    text = `${remissionGuide.reasonDescription}`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4

    text = `Direccion de partida`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4
    text = remissionGuide.originAddress
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, 0 + marginLeft, positionY)
    positionY += 4 * strArr.length

    text = `Direccion de llegada`
    pdf.text(text, 0 + marginLeft, positionY)
    positionY += 4
    text = remissionGuide.destinyAddress
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, 0 + marginLeft, positionY)
    positionY += 4 * strArr.length

    if (carrier) {
        text = `Razon social del transportista`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
        text = `${carrier?.name}`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4

        text = `Documento de identidad`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
        text = `${carrier?.documentType}: ${carrier?.document}`
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    }

    text = `Placa`
    pdf.text(text, 0 + marginLeft, positionY)
    if (carrier) {
        text = carrier.carriagePlate
        positionY += 4
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    } else {
        text = 'NINGUNO'
        positionY += 4
        pdf.text(text, 0 + marginLeft, positionY)
        positionY += 4
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cant.', 0 + marginLeft, positionY)
    pdf.text('Descripcion', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const remissionGuideItem of remissionGuideItems) {
        strArr = pdf.splitTextToSize(`${remissionGuideItem.fullName.toUpperCase()}${remissionGuideItem.observations ? ' - ' + remissionGuideItem.observations : ''}`, 65)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
        pdf.text(`${remissionGuideItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 0 + marginLeft, positionY)
        positionY += 4
    }
    return pdf
}