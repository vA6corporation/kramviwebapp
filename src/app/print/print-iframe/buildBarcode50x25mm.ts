import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode50x25mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [25, 50])
    const small = 7
    const title = 14
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 4

        JsBarcode("#barcode", product.upc || '0000000000000', {
            width: 2,
            height: 36,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'normal')
        pdf.setFontSize(small)
        text = product.fullName.toUpperCase()
        let strArr = pdf.splitTextToSize(text, 48)
        pdf.text(strArr, 3, positionY)

        pdf.addImage(jpegUrl, "JPEG", 2, positionY + 4, 48, 10)

        text = product.upc || '0000000000000'
        pdf.text(text, 3, positionY + 15, { align: 'left' })

        text = formatDate(new Date(), 'dd.MM.yy', 'en-US')
        pdf.text(text, 3, positionY + 18, { align: 'left' })

        text = 'S/'
        pdf.text(text, 32, positionY + 15, { align: 'right' })

        pdf.setFontSize(title)

        text = product.price.toFixed(2)
        pdf.text(text, 49, positionY + 18, { align: 'right' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}