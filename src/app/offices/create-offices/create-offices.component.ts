import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { OfficesService } from '../offices.service'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-create-offices',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-offices.component.html',
    styleUrls: ['./create-offices.component.sass'],
})
export class CreateOfficesComponent {

    private readonly router = inject(Router)
    private readonly formBuilder = inject(FormBuilder)
    private readonly officesService = inject(OfficesService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        tradeName: ['', Validators.required],
        address: ['', Validators.required],
        serialPrefix: ['', Validators.required],
        codigoAnexo: ['', Validators.required],
        codigoUbigeo: ['', Validators.required],
        departamento: ['', Validators.required],
        provincia: ['', Validators.required],
        distrito: ['', Validators.required],
        urbanizacion: ['', Validators.required],
        activityId: ['', Validators.required]
    })
    $isLoading = signal<boolean>(false)
    maxlength: number = 11
    $activities = signal<any[]>([])

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva sucursal')
        this.officesService.getActivities().subscribe(activities => {
            this.$activities.set(activities)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.navigationService.loadBarStart()
            this.officesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/offices'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.$isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }
}
