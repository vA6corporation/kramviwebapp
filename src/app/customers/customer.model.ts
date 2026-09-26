import { SaleModel } from '../sales/sale.model'
import { DocumentType } from './document-type.enum'

export interface CustomerModel {
    id: number
    document: string
    documentType: DocumentType,
    name: string
    email: string
    phone: string
    formatPhone: string
    address: string
    observation: string
    creditLimit: number | null
}
