import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode60x30mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [33, 60])
    const small = 9
    const title = 25
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 3

        JsBarcode("#barcode", product.upc || '0000000000000', {
            width: 4,
            height: 36,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(small)
        text = product.fullName.toUpperCase()
        let strArr = pdf.splitTextToSize(text, 58)
        pdf.text(strArr, 3, positionY)

        pdf.addImage(jpegUrl, "JPEG", 2, positionY + 4, 28, 12)

        text = product.upc || '0000000000000'
        pdf.text(text, 4, positionY + 17, { align: 'left' })

        text = formatDate(new Date(), 'dd.MM.yy', 'en-US')
        pdf.text(text, 3, positionY + 23, { align: 'left' })

        text = 'S/'
        pdf.text(text, 32, positionY + 11, { align: 'left' })

        pdf.setFontSize(title)

        text = product.price.toFixed(2)
        pdf.text(text, 36, positionY + 15, { align: 'left' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}