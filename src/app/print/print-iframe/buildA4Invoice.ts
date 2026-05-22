import { formatDate } from '@angular/common'
import jsPDF from 'jspdf'
import * as QRCode from 'qrcode'
import { SaleModel } from '../../sales/sale.model'
import { SettingModel } from '../../settings/setting.model'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { PaymentMethodModel } from '../../payment-methods/payment-method.model'
import { BankModel } from '../../banks/bank.model'
import { InvoiceCode } from '../../sales/invoice-code.enum'

export async function buildA4Invoice(
    sale: SaleModel,
    setting: SettingModel,
    business: BusinessModel,
    office: OfficeModel,
    banks: BankModel[],
    paymentMethods: PaymentMethodModel[],
    urlLogo: string
): Promise<jsPDF> {
    const title = 11
    const header = 10
    const body = 8
    const { saleItems, customer, user, payments, dues } = sale

    let invoiceTitle = ''

    switch (sale.invoiceCode) {
        case InvoiceCode.FACTURA:
            invoiceTitle = 'FACTURA ELECTRONICA'
        break
        case InvoiceCode.BOLETA:
            invoiceTitle = 'BOLETA DE VENTA ELECTRONICA'
        break
        default:
            invoiceTitle = 'NOTA DE VENTA'
        break
    }

    const pdf = new jsPDF('p', 'mm', [297, 210])
    let text: string = ''
    let strArr: string[] = []
    const pageHeight = pdf.internal.pageSize.height
    const currency = sale.currencyCode === 'PEN' ? 'S/' : '$'

    if (urlLogo) {
        pdf.addImage(urlLogo, "JPEG", 5, 5, 35, 35)
    }

    let positionYTitle = 10

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(title)
    text = (office.tradeName || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 95)
    pdf.text(strArr, 90, positionYTitle, { align: 'center' })
    positionYTitle += 3 * strArr.length

    if (office.tradeName !== business.name) {
        positionYTitle += 1
        pdf.setFont('Helvetica', 'normal')
        pdf.setFontSize(body)
        text = (business.name || '').toUpperCase()
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle, { align: 'center' })
        positionYTitle += 3 * strArr.length
    }

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    if (setting.textService) {
        text = setting.textService
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle, { align: 'center' })
        positionYTitle += (3 * strArr.length) + 1
    }

    text = office.address
    strArr = pdf.splitTextToSize(text, 95)
    pdf.text(strArr, 90, positionYTitle, { align: 'center' })
    positionYTitle += 3 * strArr.length

    if (setting.textHeader) {
        pdf.setDrawColor(0)
        pdf.setFillColor(0, 0, 0)
        pdf.roundedRect(43, positionYTitle - 1.8, 95, 4, 1, 1, 'FD')

        text = setting.textHeader
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('Helvetica', 'bold')
        strArr = pdf.splitTextToSize(text, 95)
        pdf.text(strArr, 90, positionYTitle + 1, { align: 'center' })
        pdf.setTextColor(0, 0, 0)
        pdf.setFont('Helvetica', 'normal')
        positionYTitle += 3 * strArr.length
    }

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(141, 5, 64, 35, 1, 1, 'FD')

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    text = `RUC: ${business?.ruc}`
    pdf.text(text, 171, 15, { align: 'center' })

    text = invoiceTitle || ''
    strArr = pdf.splitTextToSize(text, 50)

    if (sale.invoiceCode === InvoiceCode.BOLETA) {
        pdf.text(strArr, 172, 22, { align: 'center' })
    } else {
        pdf.text(strArr, 172, 24, { align: 'center' })
    }

    text = `${sale.invoicePrefix}${office.serialPrefix}-${sale.invoiceNumber}`
    pdf.text(text, 171, 33, { align: 'center' })

    pdf.setFontSize(body)

    let plusHeight = 0

    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.address || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)

    plusHeight += 5 * strArr.length

    let positionYCustomer = 51

    pdf.setFont('Helvetica', 'bold')
    pdf.text('SEÑOR(es)', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.name || 'VARIOS').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, 50)

    positionYCustomer += 5 * strArr.length

    pdf.setFont('Helvetica', 'bold')
    text = customer?.documentType || 'RUC'
    pdf.text(text, 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = customer?.document || ''
    pdf.text(text, 35, positionYCustomer)

    positionYCustomer += 5

    //
    if (customer?.phone) {
        pdf.setFont('Helvetica', 'bold')
        text = 'CELULAR'
        pdf.text(text, 8, positionYCustomer)
        pdf.text(':', 30, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = customer?.formatPhone
        pdf.text(text, 35, positionYCustomer)

        positionYCustomer += 5
        plusHeight += 5
    }
    //

    pdf.setFont('Helvetica', 'bold')
    pdf.text('DIRECCIÓN', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (customer?.address || '').toUpperCase()
    strArr = pdf.splitTextToSize(text, 85)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5 * strArr.length

    if (customer?.email) {
        pdf.setFont('Helvetica', 'bold')
        pdf.text('EMAIL', 8, positionYCustomer)
        pdf.text(':', 30, positionYCustomer)

        pdf.setFont('Helvetica', 'normal')
        text = customer?.email || ''
        pdf.text(text, 35, positionYCustomer)

        positionYCustomer += 5
        plusHeight += 5
    }

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, 45, 200, 15 + plusHeight, 1, 1, 'S')

    pdf.setFont('Helvetica', 'bold')
    pdf.text('OBSER.', 8, positionYCustomer)
    pdf.text(':', 30, positionYCustomer)

    pdf.setFont('Helvetica', 'normal')
    text = (sale.observation || 'NINGUNA').toUpperCase()
    strArr = pdf.splitTextToSize(text, 160)
    pdf.text(strArr, 35, positionYCustomer)

    positionYCustomer += 5

    pdf.setFont('Helvetica', 'bold')
    pdf.text('F/H EMISIÓN', 130, 50)
    pdf.text(':', 165, 50)
    pdf.text('FORMA DE PAGO', 130, 55)
    pdf.text(':', 165, 55)

    if (sale.isCredit) {
        pdf.text('N° DE CUOTAS', 130, 65)
        pdf.text(':', 165, 65)

    }

    pdf.setFont('Helvetica', 'normal')

    text = formatDate(sale.createdAt, 'dd/MM/yyyy, h:mm a', 'en-US')
    pdf.text(text, 170, 50)

    text = sale.isCredit ? 'CREDITO' : 'CONTADO'
    pdf.text(text, 170, 55)

    if (sale.isCredit) {
        text = `${formatDate(sale.dues[0]?.dueAt, 'dd/MM/yyyy', 'en-US')}`
        pdf.text(text, 170, 60)
        text = `${sale.dues.length} cuotas`
        pdf.text(text, 170, 65)
    }

    let positionYColumns = positionYCustomer
    positionYColumns += 5

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.roundedRect(5, positionYColumns, 200, 7, 1, 1, 'FD')

    pdf.setLineWidth(0.25)
    pdf.line(20, positionYColumns, 20, positionYColumns + 7)
    pdf.line(45, positionYColumns, 45, positionYColumns + 7)
    pdf.line(140, positionYColumns, 140, positionYColumns + 7)
    pdf.line(160, positionYColumns, 160, positionYColumns + 7)
    pdf.line(180, positionYColumns, 180, positionYColumns + 7)

    text = 'Cantidad'
    pdf.text(text, 6, positionYColumns + 5)

    text = 'Codigo'
    pdf.text(text, 22, positionYColumns + 5)

    text = 'Descripcion'
    pdf.text(text, 47, positionYColumns + 5)

    text = 'Unidad'
    pdf.text(text, 142, positionYColumns + 5)

    text = 'Precio Unit.'
    pdf.text(text, 163, positionYColumns + 5)

    text = 'Sub. Total'
    pdf.text(text, 183, positionYColumns + 5)

    positionYColumns += 5

    let positionYitems = positionYColumns
    positionYitems += 10

    for (const saleItem of saleItems || []) {
        text = saleItem.quantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 7, positionYitems)

        text = (saleItem.upc || '').toString()
        pdf.text(text, 23, positionYitems)

        text = saleItem.fullName.toUpperCase()

        strArr = pdf.splitTextToSize(text, 85)
        pdf.text(strArr, 47, positionYitems)

        text = saleItem.unitName || 'UNIDADES'
        pdf.text(text, 142, positionYitems)

        text = saleItem.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 163, positionYitems)

        text = (saleItem.price * saleItem.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 183, positionYitems)

        positionYitems += 5 * strArr.length

        if (saleItem.observation) {
            text = `${saleItem.observation}`
            strArr = pdf.splitTextToSize(text, 75)
            pdf.text(strArr, 47, positionYitems)

            positionYitems += 5 * strArr.length
        }

        if (positionYitems >= pageHeight - 60) {
            pdf.addPage()
            positionYitems = 5
        }
    }

    pdf.line(5, positionYitems, 205, positionYitems)

    positionYitems += 5

    text = `SON: ${sale.chargeLetters}`
    pdf.text(text, 5, positionYitems)

    text = `Usuario: ${user.name.toUpperCase()}`
    pdf.text(text, 205, positionYitems, { align: 'right' })

    if (sale.detraction) {
        positionYitems += 5
        text = `Operacion sujeta a detraccion \t N° de cuenta Banco de la nacion: ${sale.detraction.bankAccountNumber} \t Porcentaje detraccion: ${sale.detraction.percent} \t Monto detraccion: ${sale.detraction.amount}`
        pdf.text(text, 5, positionYitems)
    }

    if (banks.length) {
        positionYitems += 3
        pdf.setDrawColor(0)
        pdf.setFillColor(255, 255, 255)
        pdf.roundedRect(5, positionYitems, 200, (4 * banks.length) + 4, 1, 1, 'FD')
        pdf.setFont('Helvetica', 'bold')
        text = 'BANCO'
        pdf.text(text, 31, positionYitems + 3, { align: 'center' })
        text = 'MONEDA'
        pdf.text(text, 70, positionYitems + 3, { align: 'center' })
        text = 'CUENTA'
        pdf.text(text, 120, positionYitems + 3, { align: 'center' })
        text = 'CCI'
        pdf.text(text, 170, positionYitems + 3, { align: 'center' })

        pdf.setFont('Helvetica', 'normal')

        positionYitems += 4

        for (const bank of banks) {
            text = bank.name
            if (bank.isDetraction) {
                text += ' (Detracciones)'
            }
            pdf.text(text, 31, positionYitems + 3, { align: 'center' })
            text = bank.currencyName
            pdf.text(text, 70, positionYitems + 3, { align: 'center' })
            text = bank.accountNumber
            pdf.text(text, 120, positionYitems + 3, { align: 'center' })
            text = bank.cci
            pdf.text(text, 170, positionYitems + 3, { align: 'center' })
            positionYitems += 4
        }
    }

    positionYitems += 5

    if (sale.isRetainer) {
        pdf.setFont('Helvetica', 'bold')

        text = `Informacion de la retencion:`
        pdf.text(text, 5, positionYitems)

        pdf.setFont('Helvetica', 'normal')

        positionYitems += 5

        text = `Base imponible: ${currency} ${sale.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        pdf.text(text, 5, positionYitems)

        text = 'Porcentaje: 3.00%'
        pdf.text(text, 55, positionYitems)

        text = `Monto: ${currency} ${(sale.charge * 0.03).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        pdf.text(text, 100, positionYitems)

        pdf.setFont('Helvetica', 'bold')
        text = `Monto neto pendiente de pago: ${currency} ${(sale.charge - (sale.charge * 0.03)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        pdf.text(text, 205, positionYitems, { align: 'right' })
        pdf.setFont('Helvetica', 'normal')

        positionYitems += 5
    }

    if (sale.isCredit) {
        const sumDues = sale.dues.map(e => e.charge).reduce((a, b) => a + b, 0)
        let retainer = 0
        if (sale.isRetainer) {
            retainer = sumDues * 0.03
        }
        for (let index = 0; index < dues.length; index++) {
            const due = dues[index]
            text = `Cuota ${index + 1} - Fecha de pago: ${formatDate(due.dueAt, 'dd/MM/yyyy', 'en-US')} - Monto: ${(due.charge - (retainer / sale.dues.length)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            pdf.text(text, 5, positionYitems)
            positionYitems += 5
        }
    }

    for (let index = 0; index < payments.length; index++) {
        const payment = payments[index]
        const foundPaymentMethod = paymentMethods.find(e => e.id === payment.paymentMethodId)
        if (foundPaymentMethod) {
            text = `${foundPaymentMethod.name}: ${payment.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${formatDate(payment.createdAt, 'dd/MM/yyyy', 'en-US')}`
            pdf.text(text, 5, positionYitems)
            positionYitems += 3
        }
    }

    let positionFooter: number = positionYitems

    if (sale && business && office) {
        const qrcode = await getQRDataUrl(sale, business, office)
        pdf.addImage(qrcode, "JPEG", 5, positionFooter, 30, 30)
    }

    text = `${setting.textBottom}`
    strArr = pdf.splitTextToSize(text, 100)
    pdf.text(strArr, 38, positionFooter + 2)

    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    let heightDrawer = 35
    if (!sale.rc) {
        heightDrawer -= 4
    }
    pdf.roundedRect(140, positionFooter, 65, heightDrawer, 1, 1, 'FD')

    let positionYSummary = positionFooter
    let positionYSummaryRight = positionFooter

    positionYSummary += 5
    positionYSummaryRight += 5
    pdf.setFont('Helvetica', 'bold')

    if (sale.discount) {
        text = 'DSCTO GLOBAL'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4
    }

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = 'SUB TOTAL'
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4

        if (sale.gravado) {
            text = 'OP. GRAVADO'
            pdf.text(text, 170, positionYSummary, { align: 'right' })
            positionYSummary += 4
        }

        if (sale.exonerado) {
            text = 'OP. EXONERADO'
            pdf.text(text, 170, positionYSummary, { align: 'right' })
            positionYSummary += 4
        }

        if (sale.inafecto) {
            text = 'OP. INAFECTO'
            pdf.text(text, 170, positionYSummary, { align: 'right' })
            positionYSummary += 4
        }

        if (sale.gratuito) {
            text = 'OP. GRATUITO'
            pdf.text(text, 170, positionYSummary, { align: 'right' })
            positionYSummary += 4
        }

        text = `I.G.V. (${sale.igvPercent}%)`
        pdf.text(text, 170, positionYSummary, { align: 'right' })
        positionYSummary += 4

        if (sale.rc) {
            text = `R.C. (${sale.rcPercent}%)`
            pdf.text(text, 170, positionYSummary, { align: 'right' })
            positionYSummary += 4
        }
    }

    text = 'IMPORTE TOTAL'
    pdf.text(text, 170, positionYSummary, { align: 'right' })
    positionYSummary += 4

    pdf.setFont('Helvetica', 'normal')

    if (sale.discount) {
        text = (sale.discount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4
    }

    if (sale.invoiceCode !== InvoiceCode.NOTA_DE_VENTA) {
        text = (sale.charge - sale.igv).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        if (sale.gravado) {
            text = (sale.gravado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
            pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
            positionYSummaryRight += 4
        }

        if (sale.exonerado) {
            text = (sale.exonerado || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
            pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
            positionYSummaryRight += 4
        }

        if (sale.inafecto) {
            text = (sale.inafecto || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
            pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
            positionYSummaryRight += 4
        }

        if (sale.gratuito) {
            text = (sale.gratuito || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
            pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
            positionYSummaryRight += 4
        }

        text = sale.igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
        pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
        positionYSummaryRight += 4

        if (sale.rc) {
            text = sale.rc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
            pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
            positionYSummaryRight += 4
        }
    }

    text = (sale.charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 200, positionYSummaryRight, { align: 'right' })
    pdf.text(currency, 180, positionYSummaryRight, { align: 'right' })
    positionYSummaryRight += 4

    return pdf
}

async function getQRDataUrl(sale: SaleModel, business: BusinessModel, office: OfficeModel): Promise<string> {
    return await QRCode.toDataURL(`${business.ruc}|${sale.invoiceName.toUpperCase()}|${sale.invoicePrefix}${office.serialPrefix}|${sale.invoiceNumber}|${sale.igv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${sale.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}|${sale.createdAt}`, { margin: 0 })
}
