export interface SaleSupplyItemModel {
  supplyId: string
  sku: string|null
  fullName: string
  price: number
  quantity: number
  preIgvCode: string
  igvCode: string
  unitCode: string
  observations: string
  createdAt: string
  saleId: string
}
