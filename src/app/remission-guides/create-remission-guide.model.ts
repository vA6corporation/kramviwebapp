export interface CreateRemissionGuideModel {
    addressIndex: number
    remissionGuideTypeCode: string
    carriageTypeCode: string
    shippingWeight: string
    reasonDescription: string
    transportAt: string
    originLocationCode: string
    originAddress: string
    destinyLocationCode: string
    destinyAddress: string
    observations: string
    carrierId: string | null
    customerId: string | null
    saleId: string | null
}
