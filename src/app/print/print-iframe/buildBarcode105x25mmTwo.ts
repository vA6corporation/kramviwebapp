import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { ProductModel } from "../../products/product.model";

export async function buildBarcode105x25mmTwo(
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

        JsBarcode("#barcode", product.upc || '0000000000000', {
            width: 6,
            height: 120,
            displayValue: false
        })

        const barcode: any = document.querySelector("#barcode")
        const barcodeImg = barcode.toDataURL("image/jpeg")

        pdf.setFont('Helvetica', 'bold')
        pdf.setFontSize(body)
        text = product.fullName.toUpperCase()
        let strArr = pdf.splitTextToSize(text, 45)
        pdf.text(strArr, 25, positionY, { align: 'center' })
        pdf.text(strArr, sideRight + 25, positionY, { align: 'center' })

        pdf.setFontSize(header)

        pdf.addImage(barcodeImg, "JPEG", 3, positionY + 4, 45, 14)
        pdf.addImage(barcodeImg, "JPEG", sideRight + 3, positionY + 4, 45, 14)

        pdf.setFontSize(small)
        text = product.upc || '0000000000000'
        pdf.text(text, 25, positionY + 20, { align: 'center' })
        pdf.text(text, sideRight + 25, positionY + 20, { align: 'center' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}