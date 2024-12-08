import { ProviderModel } from "../providers/provider.model";
import { UserModel } from "../users/user.model";
import { PurchaseSupplyItemModel } from "./purchase-supply-item.model";

export interface PurchaseSupplyModel {
    _id: string
    serie: string,
    invoiceType: string
    observations: string
    providerId: string | null
    provider: ProviderModel | null
    user: UserModel
    createdAt: string
    purchasedAt: string
    charge: number
    chargeLetters: string
    discount: number
    igv: number
    deletedAt: string | null
    expirationAt: Date
    purchaseSupplyItems: PurchaseSupplyItemModel[]
}
