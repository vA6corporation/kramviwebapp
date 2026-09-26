import { Component, inject } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { ProductsService } from '../../products/products.service'
import { SettingsService } from '../settings.service'

@Component({
    selector: 'app-dialog-price-lists',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-price-lists.component.html',
    styleUrls: ['./dialog-price-lists.component.sass']
})
export class DialogPriceListsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly settingsService = inject(SettingsService)
    private readonly navigationService = inject(NavigationService)
    private readonly productsService = inject(ProductsService)
    private readonly dialogRef: MatDialogRef<DialogPriceListsComponent> = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required]
    })

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.dialogRef.close()
            const { name } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.settingsService.savePriceList(name).subscribe({
                next: () => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Agregado correctamente')
                    this.productsService.loadPriceLists()
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
