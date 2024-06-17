import { CustomerModel } from "../customers/customer.model"

export interface ReceptionModel {
  _id: string
  customers: CustomerModel[]
  customersId: string[]
  roomId: string
  saleId: string|null
  charge: number
  checkoutAt: null
  cleanedAt: null
}