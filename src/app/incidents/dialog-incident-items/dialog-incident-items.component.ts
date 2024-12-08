import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CreateIncidentItemModel } from '../create-incident-item.model';
import { IncidentsService } from '../incidents.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-incident-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-incident-items.component.html',
    styleUrls: ['./dialog-incident-items.component.sass'],
})
export class DialogIncidentItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly incidentsService: IncidentsService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogIncidentItemsComponent>,
    ) { }

    incidentItem: CreateIncidentItemModel = this.incidentsService.getIncidentItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.incidentItem.quantity, Validators.required],
        cost: [this.incidentItem.cost, Validators.required],
        isBonus: this.incidentItem.igvCode === '11' ? true : false,
    })
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.incidentItem.cost * quantity).toFixed(2))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.incidentItem.cost
        this.formGroup.get('quantity')?.patchValue(subTotal.toFixed(4))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, cost, isBonus } = this.formGroup.value
            this.incidentItem.quantity = quantity
            this.incidentItem.cost = cost
            if (isBonus) {
                this.incidentItem.igvCode = '11'
            } else {
                this.incidentItem.igvCode = this.incidentItem.preIgvCode
            }
            this.incidentsService.updateIncidentItem(this.index, this.incidentItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.incidentsService.removeIncidentItem(this.index)
    }

}
