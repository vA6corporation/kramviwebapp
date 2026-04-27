import { ProviderModel } from '../providers/provider.model'
import { UserModel } from '../users/user.model'
import { PurchaseItemModel } from './purchase-item.model'

export interface PurchaseModel {
    id: number
    serie: string,
    invoiceCode: string
    invoiceName: string
    isCredit: boolean
    observation: string
    providerId: any | null
    provider: ProviderModel | null
    user: UserModel
    createdAt: string
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
    purchaseItems: PurchaseItemModel[]
}
