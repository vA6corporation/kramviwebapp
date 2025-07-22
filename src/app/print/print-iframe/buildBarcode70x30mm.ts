import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode70x30mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [33, 70])
    const small = 9
    const title = 32
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 3

        JsBarcode("#barcode", product.upc || product.sku || 'sin codigo', {
            width: 4,
            height: 36,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(small)
        text = product.fullName.toUpperCase()
        let strArr = pdf.splitTextToSize(text, 68)
        pdf.text(strArr, 3, positionY)

        pdf.addImage(jpegUrl, "JPEG", 2, positionY + 4, 28, 12)

        text = product.upc || product.sku || 'sin codigo'
        pdf.text(text, 4, positionY + 17, { align: 'left' })

        text = formatDate(new Date(), 'dd.MM.yy', 'en-US')
        pdf.text(text, 3, positionY + 23, { align: 'left' })

        let currencyCodePosition = 40

        if (product.price > 99) {
            currencyCodePosition = 35
        }

        text = 'S/'
        pdf.text(text, currencyCodePosition, positionY + 9, { align: 'right' })

        pdf.setFontSize(title)

        text = product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 70, positionY + 14, { align: 'right' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}