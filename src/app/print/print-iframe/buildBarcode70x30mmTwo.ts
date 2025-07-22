import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode70x30mmTwo(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [33, 70])
    const small = 9
    const title = 50
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
        pdf.text(strArr, 35, positionY, { align: 'center' })

        pdf.addImage(jpegUrl, "JPEG", 7, positionY + 20, 24, 6, undefined, undefined, 90)

        text = product.upc || product.sku || 'sin codigo'
        pdf.text(text, 20, positionY + 25.5, { align: 'center', angle: 90 })

        text = formatDate(new Date(), 'dd.MM.yyyy', 'en-US')
        pdf.text(text, 68, positionY + 22, { angle: 90 })

        let currencyCodePosition = 17

        if (product.price > 99) {
            currencyCodePosition = 13
        }

        text = 'S/'
        pdf.text(text, currencyCodePosition, positionY + 10, { align: 'right' })

        pdf.setFontSize(title)

        text = product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 39, positionY + 20, { align: 'center' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}