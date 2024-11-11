import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateSaleItemModel } from '../create-sale-item.model';
import { DialogSaleItemsComponent } from '../dialog-sale-items/dialog-sale-items.component';
import { SalesService } from '../sales.service';
import { IgvType } from '../../products/igv-type.enum';
import { MaterialModule } from '../../material.module';
import { CouponsService } from '../../coupons/coupons.service';
import { CouponModel } from '../../coupons/coupon.model';
import { CouponItemModel } from '../../coupons/coupon-item.model';

@Component({
    selector: 'app-sale-items',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './sale-items.component.html',
    styleUrls: ['./sale-items.component.sass']
})
export class SaleItemsComponent {

    constructor(
        private readonly couponsService: CouponsService,
        private readonly salesService: SalesService,
        private readonly matDialog: MatDialog,
    ) { }

    coupons: CouponModel[] = []
    saleItems: CreateSaleItemModel[] = []
    couponItems: CouponItemModel[] = []
    charge: number = 0
    igvType = IgvType

    private handleSaleItems$: Subscription = new Subscription()
    private handleCouponItems$: Subscription = new Subscription()
    private handleCoupos$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleSaleItems$.unsubscribe()
        this.handleCouponItems$.unsubscribe()
        this.handleCoupos$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleSaleItems$ = this.salesService.handleSaleItems().subscribe(saleItems => {
            this.saleItems = saleItems
            this.charge = 0
            for (const saleItem of this.saleItems) {
                if (saleItem.igvCode !== '11') {
                    this.charge += saleItem.price * saleItem.quantity
                }
            }
            this.couponsService.clearCouponItems(this.charge)
            const foundCoupon = this.coupons.find(e => this.charge > e.charge)
            if (foundCoupon) {
                this.couponsService.addCouponItem(foundCoupon)
            }
        })

        this.handleCouponItems$ = this.couponsService.handleCouponItems().subscribe(couponItems => {
            this.couponItems = couponItems
        })

        this.handleCoupos$ = this.couponsService.handleCoupons().subscribe(coupons => {
            this.coupons = coupons
        })
    }

    onSelectSaleItem(index: number) {
        this.matDialog.open(DialogSaleItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: index,
        })
    }

}
