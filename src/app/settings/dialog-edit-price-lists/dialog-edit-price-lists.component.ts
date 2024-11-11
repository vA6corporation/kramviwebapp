import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { ProductsService } from '../../products/products.service';
import { SettingsService } from '../settings.service';
import { MaterialModule } from '../../material.module';

export interface DialogEditPriceListsData {
    priceListId: string
    name: string
}

@Component({
    selector: 'app-dialog-edit-price-lists',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-price-lists.component.html',
    styleUrls: ['./dialog-edit-price-lists.component.sass']
})
export class DialogEditPriceListsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogEditPriceListsData,
        private readonly formBuilder: FormBuilder,
        private readonly settingsService: SettingsService,
        private readonly navigationService: NavigationService,
        private readonly productsService: ProductsService,
        private readonly dialogRef: MatDialogRef<DialogEditPriceListsComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [this.data.name, Validators.required]
    })

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.dialogRef.close()
            const { name } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.settingsService.updatePriceList(name, this.data.priceListId).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.productsService.loadPriceLists()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
