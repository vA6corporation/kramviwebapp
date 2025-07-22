import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import { BoardModel } from "../../boards/board.model";
import { SettingModel } from "../../auth/setting.model";

export function buildPreaccount80mm(
    board: BoardModel,
    setting: SettingModel
): jsPDF {
    const { user } = board
    const pdf = new jsPDF('p', 'mm', [297, 80])
    let positionY: number = 10
    const pageCenter = 38
    const body = 10
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    pdf.setFontSize(body)
    pdf.text(`PRECUENTA MESA ${board.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    for (const boardItem of board.boardItems) {
        const strArr = pdf.splitTextToSize(`${boardItem.quantity} ${boardItem.fullName}`, 60)
        pdf.text(strArr, 1 + marginLeft, positionY)
        pdf.text((boardItem.price * boardItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 70 - marginRight, positionY, { align: 'right' })
        positionY += 5 * strArr.length
    }
    positionY += 3
    pdf.text(`IMPORTE TOTAL: ${board.boardItems.filter(e => e.igvCode !== '11').map(e => e.price * e.quantity).reduce((a, b) => a + b, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1 + marginLeft, positionY)
    positionY += 5
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}