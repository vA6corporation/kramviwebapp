import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { EventModel } from '../event.model';
import { EventsService } from '../events.service';

@Component({
    selector: 'app-dialog-date-events',
    templateUrl: './dialog-date-events.component.html',
    styleUrls: ['./dialog-date-events.component.sass']
})
export class DialogDateEventsComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly event: EventModel,
        private readonly formBuilder: FormBuilder,
        private readonly eventsService: EventsService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogDateEventsComponent>,
    ) {
        const date = new Date(this.event.scheduledAt)
        let hours = date.getHours()
        const minutes = date.getMinutes()
        let ampm = 'AM'
        if (hours > 12) {
            hours -= 12
            ampm = 'PM'
        }
        this.formGroup = this.formBuilder.group({
            hours: [hours, [Validators.required, Validators.min(0), Validators.max(12)]],
            minutes: [minutes, [Validators.required, Validators.min(0), Validators.max(60)]],
            ampm: ampm,
            scheduledAt: [date, Validators.required],
        })
    }

    formGroup: FormGroup
    isLoading: boolean = false

    minutes: any[] = [
        { value: 0, label: '00' },
        { value: 15, label: '15' },
        { value: 30, label: '30' },
        { value: 45, label: '45' }
    ]

    hours: any[] = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
    ]

    ngOnInit(): void {
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            const { hours, minutes, ampm, scheduledAt } = this.formGroup.value

            const date = new Date(scheduledAt)

            if (ampm === 'AM') {
                date.setHours(hours)
            } else {
                if ((hours + 12) >= 24) {
                    throw new Error('Formato de hora ilegal')
                }
                date.setHours(hours + 12)
            }
            date.setMinutes(minutes)
            this.eventsService.updateDate(date, this.event._id).subscribe(() => {
                this.isLoading = false
                this.dialogRef.close(true)
                this.navigationService.showMessage('Se han guardado los cambios')
            })
        }
    }

}
