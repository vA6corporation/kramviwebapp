import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerModel } from '../../customers/customer.model';
import { MaterialModule } from '../../material.module';
import { RoomModel } from '../../rooms/room.model';

export interface DialogCreateReservationData {
    customer: CustomerModel,
    room: RoomModel
}

@Component({
    selector: 'app-dialog-create-reservations',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-reservations.component.html',
    styleUrl: './dialog-create-reservations.component.sass'
})
export class DialogCreateReservationsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogCreateReservationData,
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogCreateReservationsComponent>
    ) { }

    formGroup = this.formBuilder.group({
        checkinAt: [new Date(), Validators.required],
        checkoutAt: [new Date(), Validators.required],
        // charge: [null, Validators.required],
        observations: ''
    })

    onSubmit() {
        if (this.formGroup.valid) {
            const reservation: any = this.formGroup.value
            reservation.customerId = this.data.customer._id,
                reservation.roomId = this.data.room._id
            this.dialogRef.close(reservation)
        }
    }

}
