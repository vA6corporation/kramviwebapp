import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OfficeModel } from '../../auth/office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { OfficesService } from '../../offices/offices.service';
import { UsersService } from '../users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-users',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-users.component.html',
    styleUrls: ['./edit-users.component.sass']
})
export class EditUsersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly officesService: OfficesService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        assignedOfficeId: null,
        isAdmin: false,
    })
    isLoading: boolean = false
    offices: OfficeModel[] = []
    hide: boolean = true
    private userId: string = ''

    ngOnDestroy() {
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar usuario')
        this.userId = this.activatedRoute.snapshot.params['userId']

        this.usersService.getUserById(this.userId).subscribe(user => {
            this.formGroup.patchValue(user)
        })

        this.officesService.getOfficesByGroup().subscribe(offices => {
            this.offices = offices
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.usersService.update(this.formGroup.value, this.userId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.usersService.loadUsers()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
