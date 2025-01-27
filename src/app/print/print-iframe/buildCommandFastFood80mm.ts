import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { OfficeModel } from "../../auth/office.model";
import { SettingModel } from "../../auth/setting.model";
import { SaleItemModel } from "../../sales/sale-item.model";
import { SaleModel } from "../../sales/sale.model";

export function buildCommandFastFood80mm(
    sale: SaleModel,
    saleItems: SaleItemModel[],
    office: OfficeModel,
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
    pdf.text(`TICKET N° ${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 5
    pdf.text(`${sale.isDelivery ? 'DELIVERY' : 'ESTABLECIMIENTO'}`, pageCenter, positionY, { align: 'center' })
    positionY += 8

    let totalCharge = 0

    for (const saleItem of saleItems) {
        pdf.text(`${saleItem.quantity}`, 1 + marginLeft, positionY)
        strArr = pdf.splitTextToSize(saleItem.fullName.toUpperCase(), 70 - marginRight)
        pdf.text(strArr, 7 + marginLeft, positionY)

        if (saleItem.observations) {
            positionY += 5 * strArr.length
            pdf.text('-', 1 + marginLeft, positionY)
            strArr = pdf.splitTextToSize(saleItem.observations, 55)
            pdf.text(strArr, 7 + marginLeft, positionY)
        }

        if (saleItem.igvCode !== '11') {
            totalCharge += saleItem.price * saleItem.quantity
        }

        positionY += 5 * strArr.length
        positionY += 3
    }
    pdf.setFontSize(11)
    if (setting.showChargeCommand) {
        pdf.text(`IMPORTE TOTAL: ${totalCharge.toFixed(2)}`, 1 + marginLeft, positionY)
        positionY += 8
    }
    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })
    // positionY += 5
    // pdf.text(sale.user?.name || '', pageCenter, positionY, { align: 'center' })
    return pdf
}