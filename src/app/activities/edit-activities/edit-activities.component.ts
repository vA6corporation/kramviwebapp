import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { NavigationService } from '../../navigation/navigation.service'
import { ActivitiesService } from '../activities.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-edit-activities',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-activities.component.html',
    styleUrls: ['./edit-activities.component.sass'],
})
export class EditActivitiesComponent {

    private readonly router = inject(Router)
    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly navigationService = inject(NavigationService)
    private readonly activitiesService = inject(ActivitiesService)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    $isLoading = signal<boolean>(false)
    private activityId: any = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar actividad')

        this.activityId = this.activatedRoute.snapshot.params['activityId']
        this.activitiesService.getActivityById(this.activityId).subscribe({
            next: activity => {
                this.formGroup.patchValue(activity)
            },
            error: (error: HttpErrorResponse) => {
                this.navigationService.showMessage(error.error.message)
            }
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.$isLoading.set(true)
            this.activitiesService.update(this.formGroup.value, this.activityId).subscribe({
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
