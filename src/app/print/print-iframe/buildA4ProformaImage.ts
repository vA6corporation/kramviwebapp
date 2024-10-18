import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { ProformaModel } from "../../proformas/proforma.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";
import { environment } from "../../../environments/environment";
import { BankModel } from "../../providers/bank.model";

export async function buildA4ProformaImage(
    proforma: ProformaModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[]
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const { proformaItems, customer, user } = proforma

    const pdf = new jsPDF('p', 'mm', [297, 210])
    let text: string = ''
    let strArr: string[] = []
    const pageHeight = pdf.internal.pageSize.height
    const currency = proforma.currencyCode === 'PEN' ? 'S/' : '$'

    if (setting?.logo) {
        pdf.addImage(setting.logo, "JPEG", 5, 5, 35, 35)
    }

    let positionYTitle = 10

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = (office?.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 80)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 5 * strArr.length
    pdf.setFont('Helvetica', 'normal')
    text = (business?.businessName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 80)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 5 * strArr.length

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    text = `${office?.address.toLowerCase()}`
    strArr = pdf.splitTextToSize(text, 80)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 5 * strArr.length

    text = `Cel. ${office?.mobileNumber}`
    pdf.text(text, 45, positionYTitle)
    positionYTitle += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(130, 5, 75, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 168, 15, { align: 'center' })

    text = 'PROFORMA'
    pdf.text(text, 168, 24, { align: 'center' })

    text = `P${office?.serialPrefix}-${proforma?.proformaNumber}`
    pdf.text(text, 168, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    pdf.setFont('Helvetica', 'normal')
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
    pdf.text('OBSER.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)
    
    pdf.setFont('Helvetica', 'normal')
    text = (proforma.observations || 'NINGUNA').toUpperCase()
    strArr = pdf.splitTextToSize(text, 160)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)
    pdf.text('HORA EMISIÓN', 130, 55)
    pdf.text(':', 165, 55)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(proforma?.createdAt || '', 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 170, 50)

    text = `${formatDate(proforma?.createdAt || '', 'h:mm a', 'en-US')}`
    pdf.text(text, 170, 55)

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(140, positionYColumns, 140, positionYColumns + 7)

    text = 'Detalles'
    pdf.text(text, 7, positionYColumns + 5)

    text = 'Imagen'
    pdf.text(text, 142, positionYColumns + 5)

    positionYColumns += 5

    let positionYItems = positionYColumns
    positionYItems += 10


    for (const proformaItem of proformaItems || []) {

        let subPositionYItems = positionYItems

        text = `Descripcion: ${proformaItem.fullName.toUpperCase()}`
        strArr = pdf.splitTextToSize(text, 120)
        pdf.text(strArr, 7, subPositionYItems)

        subPositionYItems += 4 * strArr.length

        text = `Cantidad: ${proformaItem.quantity.toFixed(2)}`
        pdf.text(text, 7, subPositionYItems)

        subPositionYItems += 4

        text = `Precio Unt: ${proformaItem.price.toFixed(2)}`
        pdf.text(text, 7, subPositionYItems)

        subPositionYItems += 4

        text = `Sub Total: ${(proformaItem.price * proformaItem.quantity).toFixed(2)}`
        pdf.text(text, 7, subPositionYItems)

        subPositionYItems += 4

        text = `${proformaItem.description || ''}`
        pdf.text(text, 7, subPositionYItems)

        subPositionYItems += 4

        pdf.addImage(`${environment.baseUrl}images/${proformaItem.imageId}`, "JPEG", 142, positionYItems, 35, 35)

        positionYItems += 35
    }

    if (positionYItems >= pageHeight - 50) {
        pdf.addPage()
        positionYItems = 5
    }

    pdf.line(5, positionYItems, 205, positionYItems)

    positionYItems += 5
    
    text = `SON: ${proforma.chargeLetters}`
    pdf.text(text, 7, positionYItems)

    text = `Usuario: ${user.name.toUpperCase()}`
    pdf.text(text, 205, positionYItems, { align: 'right' })

    if (banks.length) {
        positionYItems += 3
        pdf.setDrawColor(0)
        pdf.setFillColor(255, 255, 255)
        pdf.roundedRect(5, positionYItems, 200, (4 * banks.length) + 4, 1, 1, 'FD')
        pdf.setFont('Helvetica', 'bold')
        text = 'BANCO'
        pdf.text(text, 20, positionYItems + 3, { align: 'center' })
        text = 'MONEDA'
        pdf.text(text, 70, positionYItems + 3, { align: 'center' })
        text = 'CUENTA'
        pdf.text(text, 120, positionYItems + 3, { align: 'center' })
        text = 'CCI'
        pdf.text(text, 170, positionYItems + 3, { align: 'center' })

        pdf.setFont('Helvetica', 'normal')

        positionYItems += 4

        for (const bank of banks) {
            text = bank.bankName
            pdf.text(text, 20, positionYItems + 3, { align: 'center' })
            text = bank.currencyName
            pdf.text(text, 70, positionYItems + 3, { align: 'center' })
            text = bank.accountNumber
            pdf.text(text, 120, positionYItems + 3, { align: 'center' })
            text = bank.cci
            pdf.text(text, 170, positionYItems + 3, { align: 'center' })
            positionYItems += 4
        }
    }

    positionYItems += 3

    text = `${setting.textSale}`
    pdf.text(text, 7, positionYItems + 3)

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    let heightDrawer = 35
    pdf.roundedRect(140, positionYItems, 65, heightDrawer, 1, 1, 'FD')

    let positionYSummary = positionYItems
    let positionYSummaryRight = positionYItems

    positionYSummary += 5
    positionYSummaryRight += 5
    pdf.setFont('Helvetica', 'bold')

    if (proforma.discount) {
        text = 'DSCTO GLOBAL'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    text = 'SUB TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 4

    if (proforma.gravado) {
        text = 'OP. GRAVADO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    if (proforma.exonerado) {
        text = 'OP. EXONERADO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    if (proforma.inafecto) {
        text = 'OP. INAFECTO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    if (proforma.gratuito) {
        text = 'OP. GRATUITO'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    text = `I.G.V. (${proforma.igvPercent}%)`
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 4

    text = 'IMPORTE TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 4

    pdf.setFont('Helvetica', 'normal')

    if (proforma.discount) {
        text = (proforma.discount || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    text = ((proforma.charge || 0) - (proforma?.igv || 0)).toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 4

    if (proforma.gravado) {
        text = (proforma.gravado || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    if (proforma.exonerado) {
        text = (proforma.exonerado || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    if (proforma.inafecto) {
        text = (proforma.inafecto || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    if (proforma.gratuito) {
        text = (proforma.gratuito || 0).toFixed(2)
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    text = proforma.igv.toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 4

    text = (proforma.charge || 0).toFixed(2)
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 4

    return pdf
}