import { PriceModel } from "../products/price.model"

export interface CreateEventItemModel {
  productId: string
  name: string
  fullName: string
  onModel: string
  price: number
  quantity: number
  preIgvCode: string
  igvCode: string
  unitCode: string
  observations: string
  isTrackStock: boolean
  bachId: string|null
  prices: PriceModel[]
}
