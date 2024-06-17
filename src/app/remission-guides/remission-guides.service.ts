import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { ProductModel } from '../products/product.model';
import { CreateRemissionGuideModel } from './create-remission-guide.model';
import { RemissionGuideItemModel } from './remission-guide-item.model';
import { RemissionGuideModel } from './remission-guide.model';
import { CarrierModel } from '../carriers/carrier.model';

@Injectable({
    providedIn: 'root'
})
export class RemissionGuidesService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private remissionGuideItems: RemissionGuideItemModel[] = [];
    private remissionGuide: RemissionGuideModel | null = null;

    private remissionGuideItems$ = new BehaviorSubject<RemissionGuideItemModel[]>([]);

    getSunatToken(params: Params): Observable<any> {
        return this.httpService.get('remissionGuides/sunatToken', params)
    }

    setRemissionGuide(remissionGuide: RemissionGuideModel) {
        this.remissionGuide = remissionGuide;
    }

    getRemissionGuide(): RemissionGuideModel | null {
        return this.remissionGuide;
    }

    getRemissionGuideItem(index: number): RemissionGuideItemModel {
        return this.remissionGuideItems[index];
    }

    getCountRemissionGuides(params: Params): Observable<number> {
        return this.httpService.get('remissionGuides/countRemissionGuides', params);
    }

    addRemissionGuideItem(product: ProductModel) {
        const index = this.remissionGuideItems.findIndex(e => e.productId === product._id);
        if (index < 0) {
            const remissionGuideItem: RemissionGuideItemModel = {
                productId: product._id,
                sku: '',
                upc: '',
                fullName: product.fullName,
                onModel: product.onModel,
                quantity: 1,
                unitCode: product.unitCode,
                observations: '',
            };
            this.remissionGuideItems.push(remissionGuideItem);
        } else {
            const remissionGuideItem: RemissionGuideItemModel = this.remissionGuideItems[index];
            remissionGuideItem.quantity += 1;
            this.remissionGuideItems.splice(index, 1, remissionGuideItem);
        }
        this.remissionGuideItems$.next(this.remissionGuideItems);
    }

    updateRemissionGuideItem(index: number, remissionGuideItem: RemissionGuideItemModel) {
        this.remissionGuideItems.splice(index, 1, remissionGuideItem);
        this.remissionGuideItems$.next(this.remissionGuideItems);
    }

    removeRemissionGuideItem(index: number) {
        this.remissionGuideItems.splice(index, 1);
        this.remissionGuideItems$.next(this.remissionGuideItems);
    }

    setRemissionGuideItems(remissionGuideItems: RemissionGuideItemModel[]) {
        this.remissionGuideItems = remissionGuideItems;
        this.remissionGuideItems$.next(this.remissionGuideItems);
    }

    handleRemissionGuideItems(): Observable<RemissionGuideItemModel[]> {
        return this.remissionGuideItems$.asObservable();
    }

    sendRemissionGuide(remissionGuideId: string, sunattk: string) {
        return this.httpService.get(`remissionGuides/sendSunat/${remissionGuideId}/${sunattk}`);
    }

    getProvincesByDepartmentCode(departmentCode: string): Observable<any[]> {
        return this.httpService.get(`ubigeos/provincesByDepartment/${departmentCode}`);
    }

    getDistrictsByProvinceCode(provinceCode: string): Observable<any[]> {
        return this.httpService.get(`ubigeos/districtsByProvince/${provinceCode}`);
    }

    getRemissionGuidesByPage(
        pageIndex: number,
        pageSize: number,
        params: Params
    ): Observable<RemissionGuideModel[]> {
        return this.httpService.get(`remissionGuides/byPage/${pageIndex}/${pageSize}`, params);
    }

    getRemissionGuidesBySale(saleId: string): Observable<RemissionGuideModel[]> {
        return this.httpService.get(`remissionGuides/bySale/${saleId}`);
    }

    getRemissionGuideById(remissionGuideId: string): Observable<RemissionGuideModel> {
        return this.httpService.get(`remissionGuides/byId/${remissionGuideId}`);
    }

    getCdr(cdrId: string): Promise<Blob> {
        const url = `remissionGuides/cdrByCdr/${cdrId}`
        return this.httpService.getFile(url)
    }

    getXml(cdrId: string): Promise<Blob> {
        const url = `remissionGuides/xmlByCdr/${cdrId}`
        return this.httpService.getFile(url)
    }

    // getCdrByRemissionGuide(remissionGuideId: string): Observable<any> {
    //     return this.httpService.get(`remissionGuides/cdrByRemissionGuide/${remissionGuideId}`);
    // }

    createRemissionGuide(
        remissionGuide: CreateRemissionGuideModel,
        remissionGuideItems: RemissionGuideItemModel[],
        carrier: CarrierModel,
        params: Params
    ) {
        return this.httpService.post('remissionGuides', { remissionGuide, remissionGuideItems, carrier }, params);
    }

    updateRemissionGuide(
        remissionGuide: CreateRemissionGuideModel,
        remissionGuideItems: RemissionGuideItemModel[],
        carrier: CarrierModel,
        remissionGuideId: string,
    ) {
        return this.httpService.put(`remissionGuides/${remissionGuideId}`, { remissionGuide, remissionGuideItems, carrier });
    }

    deleteBySale(saleId: string): Observable<void> {
        return this.httpService.delete(`remissionGuides/bySale/${saleId}`);
    }

}
