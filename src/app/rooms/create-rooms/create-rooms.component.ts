import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { RoomsService } from '../rooms.service';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { SettingModel } from '../../auth/setting.model';

@Component({
    selector: 'app-create-rooms',
    imports: [MaterialModule, ReactiveFormsModule, RouterModule],
    templateUrl: './create-rooms.component.html',
    styleUrls: ['./create-rooms.component.sass']
})
export class CreateRoomsComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly roomsService: RoomsService,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        roomNumber: ['', Validators.required],
        beds: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        igvCode: '10'
    })
    isLoading: boolean = false
    setting: SettingModel = new SettingModel() 

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nueva habitacion')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.formGroup.patchValue({ igvCode: this.setting.defaultIgvCode })
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.navigationService.loadBarStart()
            this.isLoading = true
            this.roomsService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.router.navigate(['/rooms'])
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
