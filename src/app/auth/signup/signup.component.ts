import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.sass']
})
export class SignupComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
    ) { }

    signupForm: FormGroup = this.formBuilder.group({
        user: this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            isAdmin: true,
        }),
        business: this.formBuilder.group({
            businessName: ['', Validators.required],
            ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            mobileNumber: ['', Validators.required],
            businessType: 'TIENDA',
        }),
        office: this.formBuilder.group({
            tradeName: ['', Validators.required],
            address: ['', Validators.required]
        }),
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva empresa')
    }

    onInputMobile(value: string) {
        let result = value.replace(/ /g, '')
        if (value.includes('+')) {
            result = result.slice(3)
        }
        this.signupForm.get('business.mobileNumber')?.patchValue(result)
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { business, office, user } = this.signupForm.value
            this.authService.signup(business, office, user).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/login'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
