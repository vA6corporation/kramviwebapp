import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpService } from '../http.service'

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    save(activeModule: any, setting: any, business: any, office: any): Observable<void> {
        return this.httpService.put('businesses', { activeModule, setting, business, office })
    }

    getCertificate(certificateId: any): Promise<Blob> {
        const url = `certificates/${certificateId}`
        return this.httpService.getFile(url)
    }

    getLogo(ruc: string): Promise<Blob> {
        const url = `settings/logo/${ruc}`
        return this.httpService.getFile(url)
    }

    deleteLogo(settingUuid: any) {
        return this.httpService.delete(`settings/deleteLogo/${settingUuid}`)
    }

    uploadCertificate(formData: FormData) {
        return this.httpService.postFile('certificates', formData)
    }

    uploadLogo(formData: FormData, ruc: string) {
        return this.httpService.postFile(`settings/uploadLogo/${ruc}`, formData)
    }

    getCertificates(): Observable<any[]> {
        return this.httpService.get('certificates')
    }

    deleteCertificate(certificateUuid: any, businessId: any): Observable<void> {
        return this.httpService.delete(`certificates/${certificateUuid}/${businessId}`)
    }

    savePriceList(name: string): Observable<void> {
        return this.httpService.post('priceLists', { name })
    }

    updatePriceList(name: string, priceListId: any): Observable<void> {
        return this.httpService.put(`priceLists/${priceListId}`, { name })
    }

    deletePriceList(priceListId: any): Observable<void> {
        return this.httpService.delete(`priceLists/${priceListId}`)
    }

    updateCertificate(certificateId: any) {
        return this.httpService.get(`businesses/updateCertificate/${certificateId}`)
    }

}
