import jsPDF from "jspdf";
import { formatDate } from "@angular/common";
import JsBarcode from "jsbarcode";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode30x20mm(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [20, 90])
    const small = 7
    // const title = 14
    let text: string = ''

    for (let index = 0; index < products.length; index++) {
        const product = products[index]
        let positionY = 2

        JsBarcode("#barcode", product.upc || '0000000000000', {
            width: 2,
            height: 36,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const jpegUrl = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'normal')
        pdf.setFontSize(small)
        text = product.fullName
        let strArr = pdf.splitTextToSize(text, 26)
        pdf.text(strArr, 2, positionY, { align: 'left' })
        pdf.text(strArr, 32, positionY, { align: 'left' })
        pdf.text(strArr, 62, positionY, { align: 'left' })

        pdf.addImage(jpegUrl, "JPEG", 2, positionY + 4, 26, 10)
        pdf.addImage(jpegUrl, "JPEG", 32, positionY + 4, 26, 10)
        pdf.addImage(jpegUrl, "JPEG", 62, positionY + 4, 26, 10)

        pdf.setFontSize(small)

        text = product.upc || '0000000000000'
        pdf.text(text, 15, positionY + 15, { align: 'center' })
        pdf.text(text, 45, positionY + 15, { align: 'center' })
        pdf.text(text, 75, positionY + 15, { align: 'center' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}