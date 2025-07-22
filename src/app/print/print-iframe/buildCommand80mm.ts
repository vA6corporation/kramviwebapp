import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import { BoardModel } from "../../boards/board.model";
import { BoardItemModel } from "../../boards/board-item.model";
import { SettingModel } from "../../auth/setting.model";

export function buildCommand80mm(
    board: BoardModel,
    boardItems: BoardItemModel[],
    setting: SettingModel
): jsPDF {
    const pdf = new jsPDF('p', 'mm', [297, 80])
    let positionY: number = 10
    const pageCenter = 38
    const body = 14
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    let strArr: string[] = []
    pdf.setFontSize(body)
    pdf.text(`TICKET N° ${board.ticketNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(`MESA ${board.table.name}`, pageCenter, positionY, { align: 'center' })
    positionY += 8

    let totalCharge = 0

    for (const boardItem of boardItems) {
        pdf.text(`${boardItem.quantity}`, 1 + marginLeft, positionY)
        strArr = pdf.splitTextToSize(boardItem.fullName.toUpperCase(), 70 - marginRight)
        pdf.text(strArr, 7 + marginLeft, positionY)

        if (boardItem.observations) {
            positionY += 5 * strArr.length
            pdf.text('-', 1 + marginLeft, positionY)
            strArr = pdf.splitTextToSize(boardItem.observations, 55)
            pdf.text(strArr, 7 + marginLeft, positionY)
        }

        if (boardItem.igvCode !== '11') {
            totalCharge += boardItem.price * boardItem.quantity
        }

        positionY += 5 * strArr.length
        positionY += 3
    }
    pdf.setFontSize(11)
    if (setting.showChargeCommand) {
        pdf.text(`IMPORTE TOTAL: ${totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1 + marginLeft, positionY)
        positionY += 8
    }
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(board.user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}