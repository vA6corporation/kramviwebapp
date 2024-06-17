import { PaymentMethodModel } from "../payment-methods/payment-method.model";
import { PurchaseModel } from "../purchases/purchase.model";
import { UserModel } from "../users/user.model";

export interface PaymentPurchaseModel {
  _id: string,
  charge: number,
  currencyType: string,
  deletedAt: string|null,
  purchaseId: string,
  createdAt: string,
  user: UserModel
  paymentMethod: PaymentMethodModel,
  purchase: PurchaseModel,
}