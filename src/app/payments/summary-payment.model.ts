import { PaymentMethodModel } from "../payment-methods/payment-method.model"

export interface SummaryPaymentModel {
  totalCharge: number
  totalQuantity: number
  paymentMethod: PaymentMethodModel
}