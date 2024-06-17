import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

    constructor(
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    signupForm: FormGroup = this.formBuilder.group({
        user: this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            isAdmin: true,
        }),
        business: this.formBuilder.group({
            businessName: [null, Validators.required],
            ruc: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            mobileNumber: [null, Validators.required],
            businessType: 'TIENDA',
        }),
        office: this.formBuilder.group({
            tradeName: [null, Validators.required],
            address: [null, Validators.required]
        }),
    });
    isLoading: boolean = false;

    ngOnInit(): void { 
        this.navigationService.setTitle('Nueva empresa')
    }

    onInputMobile(value: string) {
        let result = value.replace(/ /g, '');
        if (value.includes('+')) {
            result = result.slice(3);
        }
        this.signupForm.get('business.mobileNumber')?.patchValue(result);
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            const { business, office, user } = this.signupForm.value;
            this.authService.signup(business, office, user).subscribe(() => {
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.router.navigate(['/login']);
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                console.log(error);
                this.isLoading = false;
                this.navigationService.loadBarFinish();
                this.navigationService.showMessage(error.error.message);
            });
        }
    }

}
