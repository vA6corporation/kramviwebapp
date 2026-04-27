import jsPDF from 'jspdf'
import { formatDate } from '@angular/common'
import { PreaccountModel } from '../../boards/preaccount.model'
import { SettingModel } from '../../settings/setting.model'
import { IgvCode } from '../../sales/igv-code.enum'

export function buildPreaccount58mm(
    preaccount: PreaccountModel,
    setting: SettingModel,
): jsPDF {
    const { user } = preaccount
    const pdf = new jsPDF('p', 'mm', [297, 48])
    let positionY: number = 5
    const pageCenter = 23
    const body = 10
    const marginRight = setting.marginRight
    pdf.setFontSize(body)
    pdf.text(`TICKET N° ${preaccount.ticketNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 3
    pdf.text(`PRECUENTA MESA ${preaccount.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    for (const preaccountItem of preaccount.preaccountItems) {
        const strArr = pdf.splitTextToSize(`${preaccountItem.quantity} ${preaccountItem.fullName.toUpperCase()}`, 40)
        pdf.text((preaccountItem.price * preaccountItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 47 - marginRight, positionY, { align: 'right' })
        pdf.text(strArr, 0, positionY)
        positionY += 4 * strArr.length
    }
    positionY += 3
    pdf.text(`IMPORTE TOTAL: ${preaccount.preaccountItems.filter(e => e.igvCode !== IgvCode.BONIFICACION).map(e => e.price * e.quantity).reduce((a, b) => a + b, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1, positionY)
    positionY += 7
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}
