import { ProductModel } from "../products/product.model";

export interface FavoriteModel {
    product: ProductModel
    productId: string
    countSales: number
}