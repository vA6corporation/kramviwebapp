import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode105x25mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [25, 105])
    const header = 24
    const body = 8
    const small = 8
    const sideRight = 54
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 3

        JsBarcode("#barcode", product.upc || product.sku || 'sin codigo', {
            width: 2,
            height: 30,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(body)
        text = product.fullName.toUpperCase()
        let strArr = pdf.splitTextToSize(text, 45)
        pdf.text(strArr, 5, positionY)
        pdf.text(strArr, sideRight + 5, positionY)

        pdf.setFontSize(header)
        text = 'S/'
        if (product.price > 99) {
            pdf.text(text, 8, positionY + 11.5)
            pdf.text(text, sideRight + 8, positionY + 11.5)
        } else {
            pdf.text(text, 10, positionY + 11.5)
            pdf.text(text, sideRight + 10, positionY + 11.5)
        }

        text = product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        if (product.price > 99) {
            pdf.text(text, 45, positionY + 11.5, { align: 'right' })
            pdf.text(text, sideRight + 45, positionY + 11.5, { align: 'right' })
        } else {
            pdf.text(text, 40, positionY + 11.5, { align: 'right' })
            pdf.text(text, sideRight + 40, positionY + 11.5, { align: 'right' })
        }

        pdf.addImage(jpegUrl, "JPEG", 17, positionY + 13, 35, 5)
        pdf.addImage(jpegUrl, "JPEG", sideRight + 17, positionY + 13, 35, 5)

        pdf.setFontSize(small)
        text = product.upc || product.sku || 'sin codigo'
        pdf.text(text, 18, positionY + 20)
        pdf.text(text, sideRight + 18, positionY + 20)

        pdf.setFont('Helvetica', 'normal')
        text = formatDate(new Date(), 'dd.MM.yy', 'en-US')
        pdf.text(text, 5, positionY + 18)
        pdf.text(text, sideRight + 5, positionY + 18)

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}