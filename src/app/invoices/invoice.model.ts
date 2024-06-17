import { CustomerModel } from "../customers/customer.model";

export interface InvoiceModel {
  invoiceType: string
  // deliveryType: number;
  invoiceNumber: number
  invoicePrefix: string
  customer: CustomerModel|null
  customerId: string|null
  createdAt: string
}
