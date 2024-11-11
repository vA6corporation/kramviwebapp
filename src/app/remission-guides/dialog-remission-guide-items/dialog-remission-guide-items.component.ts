import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { RemissionGuideItemModel } from '../remission-guide-item.model';
import { RemissionGuidesService } from '../remission-guides.service';

@Component({
    selector: 'app-dialog-remission-guide-items',
    templateUrl: './dialog-remission-guide-items.component.html',
    styleUrls: ['./dialog-remission-guide-items.component.sass']
})
export class DialogRemissionGuideItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly index: number,
        private readonly formBuilder: FormBuilder,
        private readonly remissionGuidesService: RemissionGuidesService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogRemissionGuideItemsComponent>,
    ) { }

    remissionGuideItem: RemissionGuideItemModel = this.remissionGuidesService.getRemissionGuideItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.remissionGuideItem.quantity, Validators.required],
        observations: this.remissionGuideItem.observations,
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

    onSubmit(): void {
        if (this.formGroup.valid) {
            const { quantity, observations } = this.formGroup.value
            this.remissionGuideItem.quantity = quantity
            this.remissionGuideItem.observations = observations
            this.remissionGuidesService.updateRemissionGuideItem(this.index, this.remissionGuideItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.remissionGuidesService.removeRemissionGuideItem(this.index)
    }

}
