import { Component, Inject } from '@angular/core';
import { CouponsService } from '../coupons.service';
import { CouponItemModel } from '../coupon-item.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { Subscription } from 'rxjs';
import { OfficeModel } from '../../auth/office.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dialog-coupon-items',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-coupon-items.component.html',
  styleUrl: './dialog-coupon-items.component.sass'
})
export class DialogCouponItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly couponId: string,
        private readonly couponsService: CouponsService,
        private readonly authService: AuthService,
    ) { }

    couponItems: CouponItemModel[] = []
    office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.couponsService.getCouponItems(this.couponId).subscribe(couponItems => {
            this.couponItems = couponItems
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })

    }

}
