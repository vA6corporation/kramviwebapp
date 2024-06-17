import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { PaymentOrderModel } from "../../payment-orders/payment-order.model";
import { SettingModel } from "../../auth/setting.model";
import { BusinessModel } from "../../auth/business.model";
import { OfficeModel } from "../../auth/office.model";

export async function buildA4PaymentOrder(
    paymentOrder: PaymentOrderModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
): Promise<jsPDF> {
    const header = 11
    const body = 8
    const { provider } = paymentOrder

    const pdf = new jsPDF('p', 'mm', [297, 210])
    let text: string = ''
    let strArr: string[] = []
    // const pageHeight = pdf.internal.pageSize.height
    if (setting?.logo) {
        pdf.addImage(setting.logo, "JPEG", 5, 5, 35, 35)
    }

    let positionYTitle = 10

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = (office?.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    pdf.setFont('Helvetica', 'normal')
    text = (business?.businessName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    if (setting.descriptionService) {
        text = setting.descriptionService || ''
        strArr = pdf.splitTextToSize(text, 90)
        pdf.text(strArr, 45, positionYTitle)
        positionYTitle += 4 * strArr.length
    }

    text = `${office?.address.toLowerCase()}`
    strArr = pdf.splitTextToSize(text, 90)
    pdf.text(strArr, 45, positionYTitle)
    positionYTitle += 4 * strArr.length

    text = office?.mobileNumber || ''
    pdf.text(text, 45, positionYTitle)
    positionYTitle += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(140, 5, 65, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 171, 15, { align: 'center' })

    text = 'ORDEN DE PAGO'
    pdf.text(text, 171, 24, { align: 'center' })

    text = `${formatDate(paymentOrder.createdAt, 'yyyyMM', 'en-US')}-${paymentOrder?.paymentOrderNumber}`
    pdf.text(text, 171, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    let positionYCustomer = 51

    pdf.setFont('Helvetica', 'bold')
    pdf.text('PROVEEDOR', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (provider?.name || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, 50)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    text = provider?.documentType || 'RUC/DNI'
    pdf.text(text, 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = provider?.document || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')

    pdf.setFont('Helvetica', 'bold')
    pdf.text('CELULAR', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = provider?.mobileNumber || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    if (provider?.email) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('EMAIL', 8, positionYCustomer)
        pdf.text(':', 30, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = provider?.email || ''
        pdf.text(text, 35, positionYCustomer)

        positionYCustomer += 5
        plusHeight += 5
    }

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, 45, 200, 30 + plusHeight, 1, 1, 'S')

    pdf.setFont('Helvetica', 'bold')
    pdf.text('OBS.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (paymentOrder.observations || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 160)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('DESCRIPCION', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = paymentOrder.concept.toUpperCase()
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA DE EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)

    pdf.setFont('Helvetica', 'bold')
    pdf.text('FECHA DE PAGO', 130, 55)
    pdf.text(':', 165, 55)

    pdf.setFont('Helvetica', 'bold')
    pdf.text('STATUS', 130, 60)
    pdf.text(':', 165, 60)

    pdf.setFont('Helvetica', 'bold')
    pdf.text('IMPORTE', 130, 65)
    pdf.text(':', 165, 65)

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(paymentOrder.createdAt, 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 170, 50)

    text = formatDate(paymentOrder.paymentAt, 'dd/MM/yyyy', 'en-US')
    pdf.text(text, 170, 55)

    text = paymentOrder.isPaid ? 'PAGADO' : 'PENDIENTE'
    pdf.text(text, 170, 60)

    text = paymentOrder.charge.toFixed(2)
    pdf.text(text, 170, 65)

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(95, positionYColumns, 95, positionYColumns + 7)

    text = `CTA PROVEEDOR ${paymentOrder.providerBankName}: ${paymentOrder.providerAccountNumber}`
    pdf.text(text, 7, positionYColumns + 5)

    text = `CTA EMPRESA ${paymentOrder.bankName}: ${paymentOrder.accountNumber}`
    pdf.text(text, 98, positionYColumns + 5)

    return pdf
}