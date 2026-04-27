export interface CreateRemissionGuideModel {
    remissionGuideCode: string
    carrierCode: string
    shippingWeight: string
    reasonDescription: string
    transportAt: string
    originLocationCode: string
    originAddress: string
    destinyLocationCode: string
    destinyAddress: string
    observation: string
    carrierId: any | null
    customerId: any | null
    saleId: any | null
}
