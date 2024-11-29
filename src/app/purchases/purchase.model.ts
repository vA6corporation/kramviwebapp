import { PaymentPurchaseModel } from "../payment-purchases/payment-purchase.model";
import { ProviderModel } from "../providers/provider.model";
import { UserModel } from "../users/user.model";
import { PurchaseItemModel } from "./purchase-item.model";

export interface PurchaseModel {
    _id: string
    serie: string,
    invoiceType: string
    isCredit: boolean
    observations: string
    providerId: string | null
    provider: ProviderModel | null
    user: UserModel
    createdAt: string
    purchasedAt: string
    charge: number
    chargeLetters: string
    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number
    discount: number
    igv: number
    deletedAt: string | null
    expirationAt: Date
    currencyCode: string
    isPaid: boolean
    payed: number
    paymentPurchases: PaymentPurchaseModel[]
    purchaseItems: PurchaseItemModel[]
}
