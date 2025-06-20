import { ProductModel } from "./product.model"

export interface CategoryModel {
    _id: string
    name: string
    color: string
    businessId: string
    products: Array<ProductModel> | null
    deletedAt: string | null
}
