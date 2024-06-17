import { PriceModel } from "../products/price.model";

export interface PromotionItemModel {
  productId: string
  sku: string|null
  fullName: string
  onModel: string
  price: number
  quantity: number
  preIgvCode: string
  igvCode: string
  unitCode: string
  unitName?: string
  unitShort?: string
  igv?: number
  isTrackStock?: boolean
  observations: string
  createdAt?: string
  saleId?: string
  totalQuantity?: number
  totalCharge?: number
  totalPurchase?: number
  categoryId?: string
  recipes?: any[]
  prices?: PriceModel[]
}
