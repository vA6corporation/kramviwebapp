import { formatDate } from '@angular/common'
import { OfficeModel } from '../../offices/office.model'
import { SettingModel } from '../../settings/setting.model'
import { SaleItemModel } from '../../sales/sale-item.model'
import { SaleModel } from '../../sales/sale.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { IgvCode } from '../../sales/igv-code.enum'
import jsPDF from 'jspdf'

export function buildCommandFastFood80mm(
    sale: SaleModel,
    saleItems: SaleItemModel[],
    office: OfficeModel,
    setting: SettingModel,
    paymentMethods: PaymentMethodModel[],
): jsPDF {
    const pdf = new jsPDF('p', 'mm', [297, 72])
    let positionY: number = 3
    const pageCenter = 35
    const body = 12
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    let strArr: string[] = []
    pdf.setFontSize(body)
    pdf.text(`TICKET N° ${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`, pageCenter, positionY, { align: 'center' })
    positionY += 10

    let totalCharge = 0

    for (const saleItem of saleItems) {
        pdf.text(`${saleItem.quantity}`, 1 + marginLeft, positionY)
        strArr = pdf.splitTextToSize(saleItem.fullName.toUpperCase(), 70 - marginRight)
        pdf.text(strArr, 7 + marginLeft, positionY)

        if (saleItem.observation) {
            positionY += 5 * strArr.length
            pdf.text('-', 1 + marginLeft, positionY)
            strArr = pdf.splitTextToSize(saleItem.observation, 55)
            pdf.text(strArr, 7 + marginLeft, positionY)
        }

        if (saleItem.igvCode !== IgvCode.BONIFICACION) {
            totalCharge += saleItem.price * saleItem.quantity
        }

        positionY += 5 * strArr.length
        positionY += 3
    }
    positionY += 5
    pdf.setFontSize(11)

    pdf.text(`IMPORTE TOTAL: ${totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 1 + marginLeft, positionY)
    positionY += 8

    pdf.text(formatDate(new Date(), 'M/d/yyyy, h:mm a', 'en-US'), pageCenter, positionY, { align: 'center' })

    if (sale.customer) {
        positionY += 5
        pdf.text(sale.customer.name, pageCenter, positionY, { align: 'center' })
        positionY += 5
        pdf.text(sale.customer.address || 'SIN DIRECCION', pageCenter, positionY, { align: 'center' })
    }

    for (const payment of sale.payments) {
        const foundPaymentMethod = paymentMethods.find(e => e.id === payment.paymentMethodId)
        if (foundPaymentMethod) {
            positionY += 5
            pdf.text(foundPaymentMethod.name, pageCenter, positionY, { align: 'center' })
        }
    }

    positionY += 5
    pdf.text(sale.observation || '', pageCenter, positionY, { align: 'center' })
    return pdf
}
