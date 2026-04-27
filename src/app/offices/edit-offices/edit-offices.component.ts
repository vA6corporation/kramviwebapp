import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { OfficesService } from '../offices.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-edit-offices',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-offices.component.html',
    styleUrls: ['./edit-offices.component.sass'],
})
export class EditOfficesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly officesService = inject(OfficesService)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        tradeName: [null, Validators.required],
        address: [null, Validators.required],
        serialPrefix: [null, Validators.required],
        codigoAnexo: [null, Validators.required],
        codigoUbigeo: [null, Validators.required],
        departamento: [null, Validators.required],
        provincia: [null, Validators.required],
        distrito: [null, Validators.required],
        urbanizacion: [null, Validators.required],
        activityId: [null, Validators.required]
    })
    $isLoading = signal<boolean>(false)
    maxlength: number = 11
    $activities = signal<any[]>([])
    user: UserModel = new UserModel()
    business: BusinessModel = new BusinessModel()
    private officeId: any = ''

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar sucursal')
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
            this.business = auth.business
            this.officesService.getActivities().subscribe(activities => {
                this.$activities.set(activities)
            })
        })

        this.officeId = this.activatedRoute.snapshot.params['officeId']
        this.officesService.getOfficeById(this.officeId).subscribe(office => {
            this.formGroup.patchValue(office)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.officesService.update(this.formGroup.value, this.officeId).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.navigationService.back()
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
