import { ProviderModel } from '../providers/provider.model'
import { UserModel } from '../users/user.model'
import { PurchaseOrderItemModel } from './purchase-order-item.model'

export interface PurchaseOrderModel {
    id: number
    purchaseOrderNumber: string
    currencyCode: string
    observation: string
    providerId: number | null
    provider: ProviderModel | null
    user: UserModel
    createdAt: string
    charge: number
    chargeLetters: string
    gravado: number
    gratuito: number
    exonerado: number
    inafecto: number
    igv: number
    deletedAt: string | null
    purchaseOrderItems: PurchaseOrderItemModel[]
}
