import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { CouponsService } from '../coupons.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-create-coupons',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-coupons.component.html',
    styleUrl: './create-coupons.component.sass'
})
export class CreateCouponsComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly couponsService: CouponsService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        charge: ['', Validators.required],
    })
    isLoading: boolean = false
    hide: boolean = true

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo cupon')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.couponsService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/coupons'])
                    this.navigationService.showMessage('Registrado correctamente')
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
