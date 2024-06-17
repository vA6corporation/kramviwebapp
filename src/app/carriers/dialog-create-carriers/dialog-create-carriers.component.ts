import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CarriersService } from '../carriers.service';

@Component({
    selector: 'app-dialog-create-carriers',
    templateUrl: './dialog-create-carriers.component.html',
    styleUrls: ['./dialog-create-carriers.component.sass']
})
export class DialogCreateCarriersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly dialogRef: MatDialogRef<DialogCreateCarriersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: 'RUC',
        document: [null, Validators.required],
        name: [null, Validators.required],
        carriagePlate: '',
        licenseNumber: '',
        mobileNumber: '',
        email: ''
    });
    documentTypes: string[] = ['RUC', 'DNI', 'CE'];
    isLoading: boolean = false;

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.carriersService.create(this.formGroup.value).subscribe(carrier => {
                this.isLoading = false;
                this.dialogRef.close(carrier);
                this.navigationService.showMessage('Registrado correctamente');
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.navigationService.showMessage(error.error.message);
            });
        }
    }

}
