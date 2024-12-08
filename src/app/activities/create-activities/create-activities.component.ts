import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { ActivitiesService } from '../activities.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-create-activities',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-activities.component.html',
    styleUrls: ['./create-activities.component.sass'],
})
export class CreateActivitiesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly activitiesService: ActivitiesService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
    })
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva actividad')
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.activitiesService.create(this.formGroup.value).subscribe({
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
