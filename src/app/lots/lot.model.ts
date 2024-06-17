import { ProductModel } from "../products/product.model";
import { UserModel } from "../users/user.model";

export interface LotModel {
    _id: string
    lotNumber: string
    quantity: number
    expirationAt: string
    product: ProductModel
    productId: string
    purchaseId: string
    user: UserModel
}