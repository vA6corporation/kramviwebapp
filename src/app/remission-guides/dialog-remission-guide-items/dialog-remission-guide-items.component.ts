import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { RemissionGuideItemModel } from '../remission-guide-item.model'
import { RemissionGuidesService } from '../remission-guides.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-remission-guide-items',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-remission-guide-items.component.html',
    styleUrls: ['./dialog-remission-guide-items.component.sass'],
})
export class DialogRemissionGuideItemsComponent {

    private readonly index: number = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly remissionGuidesService = inject(RemissionGuidesService)
    private readonly authService = inject(AuthService)
    private readonly dialogRef: MatDialogRef<DialogRemissionGuideItemsComponent> = inject(MatDialogRef)

    remissionGuideItem: RemissionGuideItemModel = this.remissionGuidesService.getRemissionGuideItem(this.index)
    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.remissionGuideItem.quantity, Validators.required],
        observation: this.remissionGuideItem.observation,
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
            const { quantity, observation } = this.formGroup.value
            this.remissionGuideItem.quantity = quantity
            this.remissionGuideItem.observation = observation
            this.remissionGuidesService.updateRemissionGuideItem(this.index, this.remissionGuideItem)
            this.dialogRef.close(this.formGroup.value)
        }
    }

    onDelete(): void {
        this.remissionGuidesService.removeRemissionGuideItem(this.index)
    }

}
