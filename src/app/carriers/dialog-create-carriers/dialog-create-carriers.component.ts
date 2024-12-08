import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CarriersService } from '../carriers.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-carriers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-carriers.component.html',
    styleUrls: ['./dialog-create-carriers.component.sass'],
})
export class DialogCreateCarriersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly dialogRef: MatDialogRef<DialogCreateCarriersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: 'RUC',
        document: ['', Validators.required],
        name: ['', Validators.required],
        carriagePlate: '',
        licenseNumber: '',
        mobileNumber: '',
        email: ''
    })
    isLoading: boolean = false

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.carriersService.create(this.formGroup.value).subscribe({
                next: carrier => {
                    this.isLoading = false
                    this.dialogRef.close(carrier)
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
