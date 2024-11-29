import { SaleModel } from "../sales/sale.model"

export interface CouponItemModel {
    name: string
    charge: number
    quantity: number
    couponId: string
    sale?: SaleModel
}