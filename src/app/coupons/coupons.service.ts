import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CouponModel } from './coupon.model';
import { CouponItemModel } from './coupon-item.model';

@Injectable({
    providedIn: 'root'
})
export class CouponsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private coupons$: BehaviorSubject<CouponModel[]> | null = null
    private couponItems: CouponItemModel[] = []
    private couponItems$ = new BehaviorSubject<CouponItemModel[]>([])

    clearCouponItems() {
        this.couponItems = []
        this.couponItems$.next([])
        // const index = this.couponItems.findIndex(e => charge < e.charge)
        // if (index > -1) {
        //     this.couponItems.splice(index, 1)
        //     this.couponItems$.next(this.couponItems)
        // }
    }

    addCouponItem(coupon: CouponModel, charge: number) {
        const foundCouponItem = this.couponItems.find(e => e.couponId === coupon._id)
        if (!foundCouponItem) {
            const couponItem = {
                name: coupon.name,
                charge: coupon.charge,
                couponId: coupon._id,
                quantity: Math.trunc(charge / coupon.charge)
            }
            this.couponItems.push(couponItem)
            this.couponItems$.next(this.couponItems)
        }
    }

    handleCoupons(): Observable<CouponModel[]> {
        if (this.coupons$ === null) {
            this.coupons$ = new BehaviorSubject<CouponModel[]>([])
            this.loadCoupons()
        }
        return this.coupons$.asObservable()
    }

    handleCouponItems() {
        return this.couponItems$.asObservable()
    }

    loadCoupons() {
        this.httpService.get('coupons').subscribe(coupons => {
            if (this.coupons$) {
                this.coupons$.next(coupons)
            }
        })
    }

    getCountCoupons(): Observable<number> {
        return this.httpService.get('coupons/countCoupons')
    }

    getCouponItems(couponId: string): Observable<CouponItemModel[]> {
        return this.httpService.get(`coupons/couponItemsByCoupon/${couponId}`)
    }

    getCouponsByPage(
        pageIndex: number,
        pageSize: number,
    ): Observable<CouponModel[]> {
        return this.httpService.get(`coupons/byPage/${pageIndex}/${pageSize}`)
    }

    getCouponById(
        couponId: string
    ): Observable<CouponModel> {
        return this.httpService.get(`coupons/byId/${couponId}`)
    }

    create(
        coupon: any, 
    ): Observable<CouponModel> {
        return this.httpService.post('coupons', { coupon })
    }

    update(
        coupon: any,
        couponId: string,
    ): Observable<void> {
        return this.httpService.put(`coupons/${couponId}`, { coupon })
    }

    delete(couponId: string): Observable<void> {
        return this.httpService.delete(`coupons/${couponId}`)
    }

}
