import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { ProformaModel } from "../../proformas/proforma.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";
import { BankModel } from "../../banks/bank.model";

export async function buildTicketProforma(
    proforma: ProformaModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[],
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const { proformaItems, customer, user } = proforma

    let plusHeigth: number = 0

    if (proformaItems.length > 10) {
        plusHeigth += proformaItems.length * 5
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
        text = setting.descriptionService || ''
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

    pdf.text('PROFORMA', pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4
    text = `P${office?.serialPrefix}-${proforma?.proformaNumber}`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 4
    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5

    text = `Fecha`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `: ${formatDate(proforma?.createdAt || '', 'dd/MM/yyyy, h:mm a', 'en-US')}`
    pdf.text(text, 18 + marginLeft, positionY)
    positionY += 4

    text = `Cliente`
    pdf.text(text, 0 + marginLeft, positionY)
    text = `${customer?.name}`
    strArr = pdf.splitTextToSize(text, 70)

    pdf.text(':', 18 + marginLeft, positionY)

    if (customer) {
        positionY += 4
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
    } else {
        pdf.text('VARIOS', 20, positionY)
        positionY += 4
    }

    if (customer?.addresses[proforma.addressIndex]) {
        text = `Direccion`
        pdf.text(text, 0 + marginLeft, positionY)
        pdf.text(':', 18 + marginLeft, positionY)
        text = `${customer?.addresses[proforma.addressIndex]}`
        positionY += 4

        strArr = pdf.splitTextToSize(text, 70)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
    }

    if (customer?.document) {
        text = `RUC/DNI`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.document || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 4
    }

    if (customer?.mobileNumber) {
        text = `Celular`
        pdf.text(text, 0 + marginLeft, positionY)
        text = `: ${customer?.mobileNumber || ''}`
        pdf.text(text, 18 + marginLeft, positionY)
        positionY += 4
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cant.', 0 + marginLeft, positionY)
    pdf.text('P. unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70 - marginRight, positionY, { align: 'right' })
    positionY += 4

    for (const proformaItem of proformaItems) {
        strArr = pdf.splitTextToSize(`${proformaItem.fullName.toUpperCase()}${proformaItem.observations ? ' - ' + proformaItem.observations : ''}`, 65)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
        pdf.text(`${proformaItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
        pdf.text((proformaItem.price).toFixed(2), pageCenter, positionY, { align: 'center' })
        pdf.text((proformaItem.price * proformaItem.quantity).toFixed(2), 70 - marginRight, positionY, { align: 'right' })
        positionY += 4
    }

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    text = `SON: ${proforma?.chargeLetters}`
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length
    positionY += 2

    text = `TOTAL DCTO`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (proforma?.discount || 0).toFixed(2)
    pdf.text(text, 50, positionY)
    positionY += 4

    text = `IMPORTE TOTAL`
    pdf.text(text, 45, positionY, { align: 'right' })
    text = (proforma?.charge || 0).toFixed(2)
    pdf.text(text, 50, positionY)
    positionY += 4

    if (banks.length) {
        positionY += 2
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

    text = proforma?.observations || ''
    strArr = pdf.splitTextToSize(text, 70)
    pdf.text(strArr, pageCenter, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    return pdf
}