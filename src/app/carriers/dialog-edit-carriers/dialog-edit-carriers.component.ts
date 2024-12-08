import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { CarrierModel } from '../carrier.model';
import { CarriersService } from '../carriers.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-edit-carriers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-carriers.component.html',
    styleUrls: ['./dialog-edit-carriers.component.sass'],
})
export class DialogEditCarriersComponent {

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
    })
    carrierId: string = this.carrier._id
    isLoading: boolean = false
    customerId: string = ''
    maxlength: number = 11

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.carriersService.update(this.formGroup.value, this.carrierId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.dialogRef.close(this.formGroup.value)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
