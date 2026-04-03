import { PaymentMethodModel } from '../payment-methods/payment-method.model'
import { PurchaseModel } from '../purchases/purchase.model'
import { UserModel } from '../users/user.model'

export interface PaymentPurchaseModel {
    id: number
    charge: number
    currencyType: string
    deletedAt: string | null
    purchaseId: number
    createdAt: string
    observation: string
    user: UserModel
    paymentMethod: PaymentMethodModel
    purchase: PurchaseModel
}
