import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CouponModel } from '../coupon.model';
import { CouponsService } from '../coupons.service';
import { DialogCouponItemsComponent } from '../dialog-coupon-items/dialog-coupon-items.component';

@Component({
    selector: 'app-coupons',
    imports: [MaterialModule, RouterModule, CommonModule],
    templateUrl: './coupons.component.html',
    styleUrl: './coupons.component.sass'
})
export class CouponsComponent {

    constructor(
        private readonly couponsService: CouponsService,
        private readonly navigationService: NavigationService,
        private readonly matDialog: MatDialog,
    ) { }

    displayedColumns: string[] = ['name', 'charge', 'countItems', 'actions']
    dataSource: CouponModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Cupones')
        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        this.couponsService.getCountCoupons().subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.couponsService.getCouponsByPage(this.pageIndex + 1, this.pageSize).subscribe(users => {
            this.navigationService.loadBarFinish()
            this.dataSource = users
        })
    }

    onDialogCouponItems(couponId: string) {
        this.matDialog.open(DialogCouponItemsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: couponId
        })
    }

    onDeleteCoupon(coupon: CouponModel) {
        const ok = confirm('Estas seguro de eliminar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            coupon.deletedAt = new Date()
            this.couponsService.update(coupon, coupon._id).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.fetchData()
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
