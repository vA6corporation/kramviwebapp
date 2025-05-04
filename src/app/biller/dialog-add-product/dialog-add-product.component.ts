import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { BillItemModel } from '../bill-item.model';
import { BillsService } from '../bills.service';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-add-product',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-add-product.component.html',
    styleUrls: ['./dialog-add-product.component.sass']
})
export class DialogAddProductComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly billsService: BillsService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogAddProductComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        fullName: ['', Validators.required],
        price: ['', Validators.required],
        quantity: [1, Validators.required],
        observations: '',
        igvCode: '10'
    })
    private setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
            this.formGroup.patchValue({ igvCode: this.setting.defaultIgvCode })
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            const billItem: BillItemModel = this.formGroup.value
            this.billsService.addBillItem(billItem)
            this.dialogRef.close()
        }
    }

}
