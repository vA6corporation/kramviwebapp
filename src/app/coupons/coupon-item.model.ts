import { SaleModel } from "../sales/sale.model"

export interface CouponItemModel {
    name: string
    charge: number
    couponId: string
    sale?: SaleModel
}