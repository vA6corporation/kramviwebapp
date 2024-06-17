import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { CustomerModel } from "../../customers/customer.model";
import { CreditModel } from "../../credits/credit.model";
import { SettingModel } from "../../auth/setting.model";

export async function buildCreditCustomer80mm(
    customer: CustomerModel,
    credits: CreditModel[],
    setting: SettingModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const marginLeft = setting.marginLeft
    const pageCenter = 35

    let plusHeigth: number = 0

    const saleItems = credits.map(e => e.saleItems).flat()

    if (saleItems.length > 10) {
        plusHeigth += saleItems.length * 5
    }

    const pdf = new jsPDF('p', 'mm', [297 + plusHeigth, 72])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 5

    text = `ESTADO DE CUENTA`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 5

    strArr = pdf.splitTextToSize(customer.name, 60)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 5

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    positionY += 4

    for (const credit of credits) {
        for (const saleItem of credit.saleItems) {
            strArr = pdf.splitTextToSize(`${saleItem.fullName}`, 60)
            pdf.text(strArr, 0 + marginLeft, positionY)
            pdf.text(`x${saleItem.quantity.toFixed(2)}`, 70, positionY, { align: 'right' })
            positionY += 3.5 * strArr.length
            pdf.text(formatDate(saleItem.createdAt || new Date(), 'dd/MM/yyyy', 'en-US'), 0 + marginLeft, positionY)
            pdf.text((saleItem.price * saleItem.quantity).toFixed(2), 70, positionY, { align: 'right' })
            positionY += 4
        }
    }

    positionY += 4

    pdf.text(`TOTAL PENDIENTE: ${credits.map(e => e.charge - e.payed).reduce((a, b) => a + b, 0).toFixed(2)}`, 0 + marginLeft, positionY)
    return pdf
}