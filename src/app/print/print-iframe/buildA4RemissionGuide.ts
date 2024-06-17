import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import * as QRCode from 'qrcode';
import { RemissionGuideModel } from "../../remission-guides/remission-guide.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA4RemissionGuide(
    remissionGuide: RemissionGuideModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const pageCenter = 105
    const { remissionGuideItems, carrier, customer, user, sale } = remissionGuide

    let invoiceTitle = 'GUIA DE REMISION ELECTRONICA\nREMITENTE'

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

    text = office?.address || ''
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    text = office?.mobileNumber || ''
    pdf.text(text, 45, positionYTitle)
    positionYTitle += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(137, 5, 68, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 171, 15, { align: 'center' })

    text = invoiceTitle || ''
    pdf.text(text, 171, 23, { align: 'center' })

    text = `T${office?.serialPrefix}-${remissionGuide?.remissionGuideNumber}`
    pdf.text(text, 171, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (customer?.addresses[remissionGuide.addressIndex] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, 45, 200, 20 + plusHeight, 1, 1, 'FD')

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
    text = (customer?.addresses[remissionGuide.addressIndex] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SUSTENTO', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = remissionGuide.reasonDescription
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('OBSER.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = remissionGuide?.observations || 'NINGUNO'
    strArr = pdf.splitTextToSize(text, 135)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA EMISIÓN', 135, 50)
    pdf.text(':', 165, 50)
    pdf.text('FECHA TRASLADO', 135, 55)
    pdf.text(':', 165, 55)
    pdf.text('COMPROBANTE', 135, 60)
    pdf.text(':', 165, 60)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(remissionGuide?.createdAt || '', 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 170, 50)

    text = `${formatDate(remissionGuide?.transportAt || '', 'dd/MM/yyyy', 'en-US')}`
    pdf.text(text, 170, 55)

    if (sale) {
        text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
    } else {
        text = `Ninguno`
    }
    pdf.text(text, 170, 60)

    let positionYCarrier = positionYCustomer
    positionYCarrier += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYCarrier, 200, 25, 1, 1, 'FD')

    positionYCarrier += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('Razon social del transportista', 8, positionYCarrier)
    pdf.text('Documento de identidad', 90, positionYCarrier)
    pdf.text('Vendedor', 170, positionYCarrier)

    positionYCarrier += 5

    pdf.setFont('Helvetica', 'normal')

    text = (carrier?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 8, positionYCarrier)

    text = (carrier ? `${carrier.documentType}: ${carrier.document}` : '').toUpperCase()
    pdf.text(text, 90, positionYCarrier)

    text = user.name
    pdf.text(text, 170, positionYCarrier)

    positionYCarrier += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('Direccion de partida', 8, positionYCarrier)
    pdf.text('Direccion de llegada', pageCenter + 3, positionYCarrier)

    positionYCarrier += 5

    pdf.setFont('Helvetica', 'normal')

    text = remissionGuide.originAddress
    strArr = pdf.splitTextToSize(text, 95)
    pdf.text(strArr, 8, positionYCarrier)

    text = remissionGuide.destinyAddress
    strArr = pdf.splitTextToSize(text, 95)
    pdf.text(strArr, pageCenter + 3, positionYCarrier)

    positionYCarrier += 5

    let positionYColumns = positionYCarrier
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(20, positionYColumns, 20, positionYColumns + 7)
    pdf.line(45, positionYColumns, 45, positionYColumns + 7)
    pdf.line(140, positionYColumns, 140, positionYColumns + 7)
    // pdf.line(160, positionYColumns, 160, positionYColumns + 7)
    // pdf.line(180, positionYColumns, 180, positionYColumns + 7)

    text = 'Cant.'
    pdf.text(text, 7, positionYColumns + 5)

    text = 'Codigo'
    pdf.text(text, 22, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 47, positionYColumns + 5)

    text = 'Unidad'
    pdf.text(text, 142, positionYColumns + 5)

    // text = 'Pre. Unit'
    // pdf.text(text, 163, positionYColumns + 5)

    // text = 'Sub. Total'
    // pdf.text(text, 183, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 10

    for (const element of remissionGuideItems) {
        text = element.quantity.toFixed(2)
        pdf.text(text, 7, positionYitems)

        text = (element.upc || '').toString()
        pdf.text(text, 23, positionYitems)

        text = element.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 90)
        pdf.text(strArr, 47, positionYitems)

        text = element.unitCode
        pdf.text(text, 142, positionYitems)

        positionYitems += 5 * strArr.length

        if (element.observations) {
            text = `S/N: ${element.observations}`
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

    if (remissionGuide && business && office) {
        const qrcode = await getQRDataUrl(remissionGuide, business, office)
        pdf.addImage(qrcode, "JPEG", 5, positionYitems, 35, 35)
    }

    text = setting.textSale
    pdf.text(text, 45, positionYitems + 4)

    return pdf
}

async function getQRDataUrl(remissionGuide: RemissionGuideModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|GUIA DE REMISION ELECTRONICA|T${office.serialPrefix}|${remissionGuide.remissionGuideNumber}|${remissionGuide.createdAt}`, { margin: 0 })
}