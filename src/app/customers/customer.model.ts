import { SaleModel } from "../sales/sale.model";
import { DocumentType } from "./document-type.enum";

export interface CustomerModel {
    _id: string
    document: string
    documentType: DocumentType,
    name: string
    email: string
    mobileNumber: string
    formatMobileNumber: string
    birthDate: string
    addresses: string[]
    locationCode: string | null
    locationName: string | null
    latitude: number
    longitude: number
    observations: string
    creditLimit: number | null

    lastSale?: SaleModel
    countSale?: number
    totalSale?: number
}
