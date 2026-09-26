import jsPDF from 'jspdf'
import { formatDate } from '@angular/common'
import { PreaccountModel } from '../../boards/preaccount.model'
import { SettingModel } from '../../settings/setting.model'
import { IgvCode } from '../../sales/igv-code.enum'

export function buildPreaccount80mm(
    preaccount: PreaccountModel,
    setting: SettingModel
): jsPDF {
    const { user } = preaccount
    const pdf = new jsPDF('p', 'mm', [297, 80])
    let positionY: number = 10
    const pageCenter = 38
    const body = 10
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    pdf.setFontSize(body)
    pdf.text(`TICKET N° ${preaccount.ticketNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 3
    pdf.text(`PRECUENTA MESA ${preaccount.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    for (const preaccountItem of preaccount.preaccountItems) {
        const strArr = pdf.splitTextToSize(`${preaccountItem.quantity} ${preaccountItem.fullName}`, 60)
        pdf.text(strArr, 1 + marginLeft, positionY)
        pdf.text((preaccountItem.price * preaccountItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 70 - marginRight, positionY, { align: 'right' })
        positionY += 5 * strArr.length
    }
    positionY += 3
    pdf.text(`IMPORTE TOTAL: ${preaccount.preaccountItems.filter(e => e.igvCode !== IgvCode.BONIFICACION).map(e => e.price * e.quantity).reduce((a, b) => a + b, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1 + marginLeft, positionY)
    positionY += 7
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}
