import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import { BoardModel } from "../../boards/board.model";
import { SettingModel } from "../../auth/setting.model";

export function buildPreaccount58mm(
    board: BoardModel,
    setting: SettingModel,
): jsPDF {
    const { user } = board
    const pdf = new jsPDF('p', 'mm', [297, 48])
    let positionY: number = 5
    const pageCenter = 23
    const body = 10
    const marginRight = setting.marginRight
    pdf.setFontSize(body)
    pdf.text(`PRECUENTA ${board.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    for (const boardItem of board.boardItems) {
        const strArr = pdf.splitTextToSize(`${boardItem.quantity} ${boardItem.fullName.toUpperCase()}`, 40)
        pdf.text((boardItem.price * boardItem.quantity).toFixed(2), 47 - marginRight, positionY, { align: 'right' })
        pdf.text(strArr, 0, positionY)
        positionY += 4 * strArr.length
    }
    positionY += 3
    pdf.text(`IMPORTE TOTAL: S/ ${board.boardItems.filter(e => e.igvCode !== '11').map(e => e.price * e.quantity).reduce((a, b) => a + b, 0).toFixed(2)}`, 1, positionY)
    positionY += 5
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}