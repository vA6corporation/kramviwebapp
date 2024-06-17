import { ProviderModel } from "../providers/provider.model";
import { UserModel } from "../users/user.model";
import { PurchaseOrderItemModel } from "./purchase-order-item.model";

export interface PurchaseOrderModel {
    _id: string
    purchaseOrderNumber: string
    currencyCode: string
    observations: string
    providerId: string | null
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
