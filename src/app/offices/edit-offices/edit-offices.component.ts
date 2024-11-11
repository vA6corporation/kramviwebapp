import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { OfficesService } from '../offices.service';

@Component({
    selector: 'app-edit-offices',
    templateUrl: './edit-offices.component.html',
    styleUrls: ['./edit-offices.component.sass']
})
export class EditOfficesComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly officesService: OfficesService,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

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
        codigoPais: [null, Validators.required],
        activityId: [null, Validators.required]
    });
    isLoading: boolean = false;
    maxlength: number = 11;
    activities: any[] = [];
    user: UserModel = new UserModel();
    business: BusinessModel = new BusinessModel();
    private officeId: string = '';

    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Editar sucursal');
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user;
            this.business = auth.business;
            this.officesService.getActivitiesByGroup().subscribe(activities => {
                this.activities = activities;
            });
        });

        this.officeId = this.activatedRoute.snapshot.params['officeId'];
        this.officesService.getOfficeById(this.officeId).subscribe(office => {
            this.formGroup.patchValue(office);
        });
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.navigationService.loadBarStart();
            this.officesService.update(this.formGroup.value, this.officeId).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.navigationService.loadBarFinish();
                    this.navigationService.showMessage('Se han guardado los cambios');
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.navigationService.loadBarFinish();
                    this.navigationService.showMessage(error.error.message);
                }
            })
        }
    }

}
