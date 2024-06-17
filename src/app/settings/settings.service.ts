import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    save(modules: any, setting: any, business: any, office: any): Observable<void> {
        return this.httpService.put('businesses', { modules, setting, business, office })
    }

    getCertificate(certificateId: string): Promise<Blob> {
        const url = `certificates/${certificateId}`
        return this.httpService.getFile(url)
    }

    updateImage(image: any) {
        return this.httpService.put('settings/updateImage', { image })
    }

    saveCertificate(formData: FormData) {
        return this.httpService.postFile('certificates', formData)
    }

    getCertificates(): Observable<any[]> {
        return this.httpService.get('certificates')
    }

    deleteCertificate(certificateId: string, businessId: string): Observable<void> {
        return this.httpService.delete(`certificates/${certificateId}/${businessId}`)
    }

    savePriceList(name: string): Observable<void> {
        return this.httpService.post('priceLists', { name })
    }

    updatePriceList(name: string, priceListId: string): Observable<void> {
        return this.httpService.put(`priceLists/${priceListId}`, { name })
    }

    deletePriceList(priceListId: string): Observable<void> {
        return this.httpService.delete(`priceLists/${priceListId}`)
    }

    updateCertificate(certificateId: string) {
        return this.httpService.get(`businesses/updateCertificate/${certificateId}`)
    }
}
