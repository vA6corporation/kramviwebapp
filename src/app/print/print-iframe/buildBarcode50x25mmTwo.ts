import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode50x25mmTwo(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [25, 50])
    const small = 7
    const title = 35
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
        let strArr = pdf.splitTextToSize(text, 48)
        pdf.text(strArr, 25, positionY, { align: 'center' })

        pdf.addImage(jpegUrl, "JPEG", 4, positionY + 15, 18, 4, undefined, undefined, 90)

        text = product.upc || product.sku || 'sin codigo'
        pdf.text(text, 14, positionY + 19, { align: 'center', angle: 90 })

        text = formatDate(new Date(), 'dd.MM.yyyy', 'en-US')
        pdf.text(text, 49, positionY + 18, { angle: 90 })

        let currencyCodePosition = 11

        if (product.price > 99) {
            currencyCodePosition = 9
        }

        text = 'S/'
        pdf.text(text, currencyCodePosition, positionY + 8, { align: 'right' })

        pdf.setFontSize(title)

        text = product.price.toFixed(2)
        pdf.text(text, 28, positionY + 15, { align: 'center' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}