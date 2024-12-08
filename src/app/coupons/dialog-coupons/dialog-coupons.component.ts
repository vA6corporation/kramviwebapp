import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CouponModel } from '../coupon.model';
import { CouponsService } from '../coupons.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-coupons',
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-coupons.component.html',
    styleUrl: './dialog-coupons.component.sass'
})
export class DialogCouponsComponent {

    constructor(
        private readonly couponsService: CouponsService,
    ) { }

    coupons: CouponModel[] = []

    ngOnInit() {
        this.couponsService.handleCoupons().subscribe(coupons => {
            this.coupons = coupons
        })
    }

}
