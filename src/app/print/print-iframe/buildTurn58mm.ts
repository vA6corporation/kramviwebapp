import { formatDate } from "@angular/common";
import jsPDF from "jspdf";
import { TurnModel } from "../../turns/turn.model";
import { ExpenseModel } from "../../expenses/expense.model";
import { SummaryPaymentModel } from "../../payments/summary-payment.model";
import { SummarySaleItemModel } from "../../sales/summary-sale-item.model";
import { SettingModel } from "../../auth/setting.model";

export function buildTurn58mm(
    turn: TurnModel,
    expenses: ExpenseModel[],
    summaryPayments: SummaryPaymentModel[],
    summarySaleItems: SummarySaleItemModel[],
    setting: SettingModel,
): jsPDF {
    const header = 9
    const body = 7
    const marginLeft = setting.marginLeft
    const marginRight = setting.marginRight
    const pageCenter = 24

    const totalCollected = summaryPayments.map(e => e.totalCharge).reduce((a, b) => a + b, 0)
    const totalCash = summaryPayments.filter(e => e.paymentMethod.name === 'EFECTIVO').map(e => e.totalCharge).reduce((a, b) => a + b, 0)
    const totalExpenses = expenses.map(e => e.charge).reduce((a, b) => a + b, 0)

    const pdf = new jsPDF('p', 'mm', [297 + (4 * summarySaleItems.length), 48])
    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)
    let text: string = ''
    let strArr: string[] = []
    let positionY: number = 3

    text = `ESTADO DE CAJA`
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    text = formatDate(turn.createdAt || '', 'dd/MM/yyyy', 'en-US')
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    text = turn.user.name
    pdf.text(text, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    for (const expense of expenses) {
        strArr = pdf.splitTextToSize(expense.concept.toUpperCase(), 47)
        pdf.text(strArr, 0, positionY)
        text = expense.charge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 47, positionY, { align: 'right' })
        positionY += 4 * strArr.length
    }

    positionY += 4

    for (const summaryPayment of summaryPayments) {
        text = `${summaryPayment.paymentMethod.name}(${summaryPayment.totalQuantity})`
        pdf.text(text, 25, positionY, { align: 'right' })
        text = summaryPayment.totalCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 29, positionY)
        positionY += 4
    }

    positionY += 4

    pdf.setFont('Helvetica', 'bold')
    pdf.setFontSize(header)

    text = `T. RECAUDADO`
    pdf.text(text, 25, positionY, { align: 'right' })
    text = totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 29, positionY)
    positionY += 4

    text = `T. GASTOS`
    pdf.text(text, 25, positionY, { align: 'right' })
    text = totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 29, positionY)
    positionY += 4

    text = `M. APERTURA`
    pdf.text(text, 25, positionY, { align: 'right' })
    text = turn.openCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 29, positionY)
    positionY += 4

    text = `E. RESTANTE`
    pdf.text(text, 25, positionY, { align: 'right' })
    text = (turn.openCash + totalCash - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    pdf.text(text, 29, positionY)
    positionY += 4

    pdf.setFont('Helvetica', 'normal')
    pdf.setFontSize(body)

    strArr = pdf.splitTextToSize(turn.observations || '', 47)
    pdf.text(strArr, pageCenter + marginLeft, positionY, { align: 'center' })
    positionY += 4 * strArr.length

    pdf.text('Cantidad', 0 + marginLeft, positionY)
    pdf.text('Precio U.', pageCenter, positionY, { align: 'center' })
    pdf.text('Sub total', 47 - marginRight, positionY, { align: 'right' })

    positionY += 4

    for (const summarySaleItem of summarySaleItems) {
        strArr = pdf.splitTextToSize(`${summarySaleItem.fullName.toUpperCase()}`, 47)
        pdf.text(strArr, 0 + marginLeft, positionY)
        positionY += 4 * strArr.length
        pdf.text(`${Number(summarySaleItem.totalQuantity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`, 0 + marginLeft, positionY)
        pdf.text(`${Number((summarySaleItem.totalSale / summarySaleItem.totalQuantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`, 25, positionY)
        pdf.text(summarySaleItem.totalSale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 47, positionY, { align: 'right' })
        positionY += 4
    }

    return pdf
}