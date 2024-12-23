import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivitiesService } from '../activities.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-edit-activities',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-activities.component.html',
    styleUrls: ['./edit-activities.component.sass'],
})
export class EditActivitiesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly activitiesService: ActivitiesService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    isLoading: boolean = false
    private activityId: string = ''

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
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.activitiesService.update(this.formGroup.value, this.activityId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.router.navigate(['/activities'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
