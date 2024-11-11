import { Component } from '@angular/core';
import { CouponsService } from '../coupons.service';
import { NavigationService } from '../../navigation/navigation.service';
import { CouponModel } from '../coupon.model';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogCouponItemsComponent } from '../dialog-coupon-items/dialog-coupon-items.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-coupons',
  standalone: true,
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
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

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
