import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CarrierModel } from '../carrier.model';
import { CarriersService } from '../carriers.service';

@Component({
    selector: 'app-dialog-edit-carriers',
    templateUrl: './dialog-edit-carriers.component.html',
    styleUrls: ['./dialog-edit-carriers.component.sass']
})
export class DialogEditCarriersComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly carrier: CarrierModel,
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly dialogRef: MatDialogRef<DialogEditCarriersComponent>,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        _id: this.carrier._id,
        documentType: this.carrier.documentType,
        document: this.carrier.document,
        name: [this.carrier.name, Validators.required],
        carriagePlate: this.carrier.carriagePlate,
        licenseNumber: this.carrier.licenseNumber,
        mobileNumber: this.carrier.mobileNumber,
        email: [this.carrier.email, Validators.email]
    });

    carrierId: string = this.carrier._id;
    documentTypes: string[] = ['RUC', 'DNI', 'CE'];
    isLoading: boolean = false;
    customerId: string = '';
    maxlength: number = 11;

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true;
            this.carriersService.update(this.formGroup.value, this.carrierId).subscribe(() => {
                this.isLoading = false;
                Object.assign(this.carrier, this.formGroup.value);
                this.dialogRef.close(this.carrier);
                this.navigationService.showMessage('Se han guardado los cambios');
            }, (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.navigationService.showMessage(error.error.message);
            });
        }
    }

}
