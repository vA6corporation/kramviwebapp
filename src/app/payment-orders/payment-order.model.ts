import { PaymentMethodModel } from '../payment-methods/payment-method.model'
import { ProviderModel } from '../providers/provider.model'

export interface PaymentOrderModel {
    id: number
    concept: string
    charge: number
    observation: string
    paymentAt: string
    createdAt: string
    isPaid: number
    serie: string
    providerId: number
    operationNumber: string
    urlPdf: string
    paymentOrderNumber: number
    providerBankName: string
    providerAccountNumber: string
    name: string
    accountNumber: string
    provider: ProviderModel
    paymentMethod: PaymentMethodModel
}
