import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { ActivitiesService } from '../activities.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-create-activities',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-activities.component.html',
    styleUrls: ['./create-activities.component.sass'],
})
export class CreateActivitiesComponent {

    private readonly router = inject(Router)
    private readonly formBuilder = inject(FormBuilder)
    private readonly navigationService = inject(NavigationService)
    private readonly activitiesService = inject(ActivitiesService)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    $isLoading = signal<boolean>(false)

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva actividad')
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.$isLoading.set(true)
            this.activitiesService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.$isLoading.set(false)
                    this.router.navigate(['/activities'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.$isLoading.set(false)
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
