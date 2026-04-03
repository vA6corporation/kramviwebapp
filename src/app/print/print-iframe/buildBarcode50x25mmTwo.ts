import jsPDF from 'jspdf'
import { formatDate } from '@angular/common'
import JsBarcode from 'jsbarcode'
import { ProductModel } from '../../products/product.model'

export async function buildBarcode50x25mmTwo(
    products: ProductModel[],
): Promise<jsPDF> {
    const pdf = new jsPDF('l', 'mm', [25, 50])
    const small = 7
    const title = 34
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

        pdf.addImage(jpegUrl, "JPEG", 7, positionY + 13, 18, 6, undefined, undefined, 90)

        text = product.upc || 'sin codigo'
        pdf.text(text, 17, positionY + 19, { align: 'center', angle: 90 })

        text = formatDate(new Date(), 'dd.MM.yyyy', 'en-US')
        pdf.text(text, 49, positionY + 18, { angle: 90 })

        pdf.setFontSize(title)

        text = product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        pdf.text(text, 28, positionY + 15, { align: 'center' })

        pdf.setFontSize(small)

        text = product.sku || ''
        pdf.text(text, 25, positionY + 20, { align: 'center' })

        if (index + 1 < products.length) {
            pdf.addPage()
        }

    }

    return pdf
}
