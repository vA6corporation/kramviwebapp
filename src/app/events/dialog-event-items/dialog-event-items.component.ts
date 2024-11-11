import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateEventItemModel } from '../create-event-item.model';
import { EventsService } from '../events.service';

@Component({
    selector: 'app-dialog-event-items',
    templateUrl: './dialog-event-items.component.html',
    styleUrls: ['./dialog-event-items.component.sass']
})
export class DialogEventItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly eventsService: EventsService,
        private readonly dialogRef: MatDialogRef<DialogEventItemsComponent>,
    ) { }

    eventItem: CreateEventItemModel = this.eventsService.getEventItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.eventItem.quantity, Validators.required],
        price: [this.eventItem.price, Validators.required],
        isBonus: this.eventItem.igvCode === '11' ? true : false,
    })

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, price, isBonus } = this.formGroup.value
            this.eventItem.quantity = quantity
            this.eventItem.price = price
            if (isBonus) {
                this.eventItem.igvCode = '11'
            } else if (this.eventItem.preIgvCode !== '11') {
                this.eventItem.igvCode = this.eventItem.preIgvCode
            } else {
                this.eventItem.igvCode = '10'
            }
            console.log(this.eventItem)
            this.eventsService.updateEventItem(this.index, this.eventItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.eventsService.removeEventItem(this.index)
    }

}
