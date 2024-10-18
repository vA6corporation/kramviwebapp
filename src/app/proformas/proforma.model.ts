import { CustomerModel } from "../customers/customer.model";
import { PaymentModel } from "../payments/payment.model";
import { SaleModel } from "../sales/sale.model";
import { UserModel } from "../users/user.model";
import { ProformaItemModel } from "./proforma-item.model";

export interface ProformaModel {
    _id: string
    addressIndex: number
    proformaNumber: string
    observations: string
    customerId: string | null
    customer: CustomerModel | null
    user: UserModel
    createdAt: string
    charge: number
    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number
    igv: number
    igvPercent: number
    deletedAt: string | null
    expirationAt: Date
    chargeLetters: String
    cash: number
    currencyCode: string
    discount: number | null

    sale: SaleModel | null
    payments: PaymentModel[]
    proformaItems: ProformaItemModel[]
}
