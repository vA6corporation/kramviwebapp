import { ProductModel } from './product.model'

export interface CategoryModel {
    id: number
    name: string
    color: string
    businessId: any
    products: ProductModel[] | null
    deletedAt: string | null
}
