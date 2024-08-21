import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { UsersService } from '../users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-users',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-users.component.html',
    styleUrls: ['./create-users.component.sass']
})
export class CreateUsersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private readonly navigationService: NavigationService,
        private readonly officesService: OfficesService,
        private readonly authService: AuthService,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(3)]],
        assignedOfficeId: null,
    });
    isLoading: boolean = false;
    offices: OfficeModel[] = [];
    hide: boolean = true;

    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo usuario');

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.officesService.getOfficesByGroup().subscribe(offices => {
                this.offices = offices;
            });
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.usersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/users'])
                    this.usersService.loadUsers()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
