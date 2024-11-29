import { Component, Inject } from '@angular/core';
import { CouponsService } from '../coupons.service';
import { CouponItemModel } from '../coupon-item.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { Subscription } from 'rxjs';
import { OfficeModel } from '../../auth/office.model';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { buildExcel } from '../../buildExcel';
import { formatDate } from '@angular/common';

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
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
    ) { }

    couponItems: CouponItemModel[] = []
    office: OfficeModel = new OfficeModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.loadBarStart()
        this.couponsService.getCouponItems(this.couponId).subscribe(couponItems => {
            this.navigationService.loadBarFinish()
            this.couponItems = couponItems
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
        })
    }

    onExportExcel() {
        const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
        let body = []
        body.push([
            'F. DE VENTA',
            'CLIENTE',
            'COMPROBANTE',
        ])
        for (const couponItem of this.couponItems) {
            body.push([
                formatDate(couponItem.sale?.createdAt || '', 'dd/MM/yyyy', 'en-US'),
                couponItem.sale?.customer?.name,
                couponItem.sale?.invoicePrefix + this.office.serialPrefix + '-' + couponItem.sale?.invoiceNumber
            ])
        }
        const name = `CUPONES`
        buildExcel(body, name, wscols, [])
    }

}
