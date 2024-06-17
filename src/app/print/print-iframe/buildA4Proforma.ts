import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { ProformaModel } from "../../proformas/proforma.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";
import { BankModel } from "../../providers/bank.model";

export async function buildA4Proforma(
    proforma: ProformaModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[]
): Promise<jsPDF> {
    const title = 11
    const header = 10
    const body = 8
    let pages = 0
    const { proformaItems, customer, user } = proforma

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
    pdf.text(text, 171, 15, { align: 'center' })

    text = 'PROFORMA'
    pdf.text(text, 171, 24, { align: 'center' })

    text = `P${office.serialPrefix}-${proforma.proformaNumber}`
    pdf.text(text, 171, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    text = (customer?.addresses[proforma.addressIndex] || '').toUpperCase()
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
    text = (customer?.addresses[proforma.addressIndex] || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    pdf.text('TELEFONO', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.mobileNumber || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)
    pdf.text('HORA EMISIÓN', 130, 55)
    pdf.text(':', 165, 55)
    pdf.text('USUARIO', 130, 60)
    pdf.text(':', 165, 60)
    pdf.text('OBSERVACIONES', 130, 65)
    pdf.text(':', 165, 65)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(proforma.createdAt || '', 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 170, 50)

    text = `${formatDate(proforma.createdAt || '', 'h:mm a', 'en-US')}`
    pdf.text(text, 170, 55)

    text = user.name
    pdf.text(text, 170, 60)

    text = proforma.observations || 'NINGUNO'
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 170, 65)

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(30, positionYColumns, 30, positionYColumns + 7)
    pdf.line(45, positionYColumns, 45, positionYColumns + 7)
    pdf.line(65, positionYColumns, 65, positionYColumns + 7)
    pdf.line(160, positionYColumns, 160, positionYColumns + 7)
    pdf.line(180, positionYColumns, 180, positionYColumns + 7)

    text = 'Codigo'
    pdf.text(text, 6, positionYColumns + 5)

    text = 'Cantidad'
    pdf.text(text, 31, positionYColumns + 5)

    text = 'Unidad'
    pdf.text(text, 46, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 66, positionYColumns + 5)

    text = 'Precio Unit.'
    pdf.text(text, 162, positionYColumns + 5)

    text = 'Sub. Total'
    pdf.text(text, 182, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 10

    for (const proformaItem of proformaItems || []) {

        text = (proformaItem.upc || '').toString()
        pdf.text(text, 6, positionYitems)

        text = proformaItem.quantity.toFixed(2)
        pdf.text(text, 31, positionYitems)

        text = proformaItem.unitName
        pdf.text(text, 45, positionYitems)

        text = proformaItem.fullName.toUpperCase()
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 66, positionYitems)

        text = proformaItem.price.toFixed(2)
        pdf.text(text, 163, positionYitems)

        text = (proformaItem.price * proformaItem.quantity).toFixed(2)
        pdf.text(text, 183, positionYitems)

        positionYitems += 5 * strArr.length

        if (proformaItem.observations) {
            text = proformaItem.observations
            strArr = pdf.splitTextToSize(text, 75)
            pdf.text(strArr, 47, positionYitems)

            positionYitems += 5 * strArr.length
        }

        if (positionYitems >= pageHeight - 35 && pages === 0) {
            pdf.addPage()
            positionYitems = 10
        }
    }

    pdf.line(5, positionYitems, 205, positionYitems)

    positionYitems += 5

    text = `SON: ${proforma.chargeLetters}`
    pdf.text(text, 7, positionYitems)

    text = `Usuario: ${user.name.toUpperCase()}`
    pdf.text(text, 205, positionYitems, { align: 'right' })

    if (banks.length) {
        positionYitems += 3
        pdf.setDrawColor(0)
        pdf.setFillColor(255, 255, 255)
        pdf.roundedRect(5, positionYitems, 200, (4 * banks.length) + 4, 1, 1, 'FD')
        pdf.setFont('Helvetica', 'bold')
        text = 'BANCO'
        pdf.text(text, 20, positionYitems + 3, { align: 'center' })
        text = 'MONEDA'
        pdf.text(text, 70, positionYitems + 3, { align: 'center' })
        text = 'CUENTA'
        pdf.text(text, 120, positionYitems + 3, { align: 'center' })
        text = 'CCI'
        pdf.text(text, 170, positionYitems + 3, { align: 'center' })

        pdf.setFont('Helvetica', 'normal')

        positionYitems += 4

        for (const bank of banks) {
            text = bank.bankName
            pdf.text(text, 20, positionYitems + 3, { align: 'center' })
            text = bank.currencyName
            pdf.text(text, 70, positionYitems + 3, { align: 'center' })
            text = bank.accountNumber
            pdf.text(text, 120, positionYitems + 3, { align: 'center' })
            text = bank.cci
            pdf.text(text, 170, positionYitems + 3, { align: 'center' })
            positionYitems += 4
        }
    }

    positionYitems += 3

    text = `${setting.textSale}`
    pdf.text(text, 7, positionYitems + 3)

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(140, positionYitems, 65, 13, 1, 1, 'FD')

    let positionYSummary = positionYitems
    let positionYSummaryRight = positionYitems

    positionYSummary += 5
    positionYSummaryRight += 5
    pdf.setFont('Helvetica', 'bold')

    text = 'DSCTO GLOBAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 5

    text = 'IMPORTE TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 5

    pdf.setFont('Helvetica', 'normal')

    const currency = proforma.currencyCode === 'PEN' ? 'S/' : '$'

    text = (proforma.discount || 0).toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    text = (proforma.charge || 0).toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 5

    return pdf
}