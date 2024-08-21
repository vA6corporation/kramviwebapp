import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode110x30mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [25, 101])
    const header = 38
    const body = 10
    const small = 8
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 10

        JsBarcode("#barcode", product.upc || '0000000000000', {
            width: 2,
            height: 30,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(body)
        text = product.fullName.toUpperCase()
        pdf.text(text, 1, positionY)

        pdf.addImage(jpegUrl, "JPEG", 5, positionY + 1, 45, 9)

        text = 'S/'
        if (product.price > 99) {
            pdf.text(text, 50, positionY + 5)
        } else if(product.price > 9) {
            pdf.text(text, 55, positionY + 5)
        } else {
            pdf.text(text, 60, positionY + 5)
        }

        pdf.setFontSize(header)
        text = product.price.toFixed(2)
        pdf.text(text, 93, positionY + 13, { align: 'right' })

        pdf.setFontSize(small)
        text = product.upc || '0000000000000'
        pdf.text(text, 18, positionY + 11)

        text = formatDate(new Date(), 'dd.MM.yy', 'en-US')
        pdf.text(text, 22, positionY + 14)

        if (index + 1 < products.length) {
            pdf.addPage()
        }
    }

    return pdf
}