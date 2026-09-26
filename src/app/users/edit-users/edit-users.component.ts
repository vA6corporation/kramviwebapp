import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { OfficeModel } from '../../offices/office.model'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../../offices/offices.service'
import { UsersService } from '../users.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-edit-users',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-users.component.html',
    styleUrls: ['./edit-users.component.sass']
})
export class EditUsersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly usersService = inject(UsersService)
    private readonly navigationService = inject(NavigationService)
    private readonly officesService = inject(OfficesService)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        officeId: null,
        isAdmin: false,
    })
    $isLoading = signal<boolean>(false)
    $offices = signal<OfficeModel[]>([])
    hide: boolean = true
    private userId: any = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Editar usuario')
        this.userId = this.activatedRoute.snapshot.params['userId']

        this.usersService.getUserById(this.userId).subscribe(user => {
            this.formGroup.patchValue(user)
        })

        this.officesService.getOffices().subscribe(offices => {
            this.$offices.set(offices)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.usersService.update(this.formGroup.value, this.userId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.navigationService.back()
                    this.usersService.loadUsers()
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
