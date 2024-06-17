import jsPDF from "jspdf";
import { SettingModel } from "src/app/auth/setting.model";
import { SaleModel } from "src/app/sales/sale.model";

export async function buildAttentionTicket80mm(
    sale: SaleModel,
    setting: SettingModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8.5
    const marginLeft = setting.marginLeft

    const { saleItems } = sale

    let plusHeigth: number = 0

    if (sale.saleItems.length > 10) {
        plusHeigth += sale.saleItems.length * 5
    }

    const pdf = new jsPDF('p', 'mm', [297 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 5
    const pageCenter = 35
    text = 'TICKET DE ATENCION'
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)
    positionY += 4

    pdf.line(0 + marginLeft, positionY, 75, positionY) // horizontal line
    positionY += 5
    pdf.text('Cant.', 0 + marginLeft, positionY)
    pdf.text('P. unitario', pageCenter + marginLeft, positionY, { align: 'center' })
    pdf.text('Importe', 70, positionY, { align: 'right' })
    positionY += 4

    for (const saleItem of saleItems) {
        strArr = pdf.splitTextToSize(`${saleItem.fullName.toUpperCase()}${saleItem.observations ? ' - ' + saleItem.observations : ''}`, 65)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
        pdf.text(`${saleItem.quantity.toFixed(2)}`, 0 + marginLeft, positionY)
        pdf.text((saleItem.price).toFixed(2), pageCenter, positionY, { align: 'center' })
        pdf.text((saleItem.price * saleItem.quantity).toFixed(2), 70, positionY, { align: 'right' })
        positionY += 4
    }

    return pdf
}