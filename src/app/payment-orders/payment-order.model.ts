import { ProviderModel } from "../providers/provider.model";

export interface PaymentOrderModel {
    _id: string
    concept: string
    charge: number
    observations: string
    paymentAt: string
    createdAt: string
    isPaid: number
    serie: string
    providerId: string
    operationNumber: string
    urlPdf: string
    paymentOrderNumber: number
    providerBankName: string
    providerAccountNumber: string
    bankName: string
    accountNumber: string
    paymentCode: string
    paymentType: string
    provider: ProviderModel
}