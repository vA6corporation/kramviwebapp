import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import { BoardModel } from "../../boards/board.model";
import { BoardItemModel } from "../../boards/board-item.model";
import { SettingModel } from "../../auth/setting.model";

export function buildCommand58mm(
    board: BoardModel,
    boardItems: BoardItemModel[],
    setting: SettingModel
): jsPDF {
    const pdf = new jsPDF('p', 'mm', [297, 48])
    const { user } = board
    let positionY: number = 10
    const pageCenter = 23
    const body = 12
    const marginLeft = setting.marginLeft
    pdf.setFontSize(body)
    pdf.text(`TICKET N° ${board.ticketNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(`MESA ${board.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 8
    let strArr = []
    let totalCharge = 0

    for (const boardItem of boardItems) {
        strArr = pdf.splitTextToSize(boardItem.fullName.toUpperCase(), 47)
        pdf.text(strArr, 0, positionY)
        if (boardItem.observations) {
            positionY += 5 * strArr.length
            strArr = pdf.splitTextToSize(`-${boardItem.observations}`, 47)
            pdf.text(strArr, 0, positionY)
        }

        if (boardItem.igvCode !== '11') {
            totalCharge += boardItem.price * boardItem.quantity
        }

        positionY += 4 * strArr.length
        pdf.text(`${boardItem.quantity}`, 0, positionY)
        positionY += 5
    }
    positionY += 3
    if (setting.showChargeCommand) {
        pdf.text(`IMPORTE TOTAL: ${totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1 + marginLeft, positionY)
        positionY += 8
    }
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}