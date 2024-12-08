import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CouponsService } from '../coupons.service';

@Component({
    selector: 'app-edit-coupons',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-coupons.component.html',
    styleUrl: './edit-coupons.component.sass'
})
export class EditCouponsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly couponsService: CouponsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        charge: ['', Validators.required],
    })
    isLoading: boolean = false
    hide: boolean = true
    couponId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar cupon')

        this.couponId = this.activatedRoute.snapshot.params['couponId']
        this.couponsService.getCouponById(this.couponId).subscribe(coupon => {
            this.formGroup.patchValue(coupon)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.couponsService.update(this.formGroup.value, this.couponId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.couponsService.loadCoupons()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
