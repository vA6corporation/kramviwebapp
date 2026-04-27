import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { ProviderModel } from '../../providers/provider.model'
import { ProvidersService } from '../../providers/providers.service'

@Component({
    selector: 'app-dialog-edit-providers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-edit-providers.component.html',
    styleUrls: ['./dialog-edit-providers.component.sass']
})
export class DialogEditProvidersComponent {

    private readonly provider: ProviderModel = inject(MAT_DIALOG_DATA)
    private readonly formBuilder = inject(FormBuilder)
    private readonly providersService = inject(ProvidersService)
    private readonly dialogRef: MatDialogRef<DialogEditProvidersComponent> = inject(MatDialogRef)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        documentType: 'DNI',
        document: '',
        name: ['', Validators.required],
        address: '',
        phone: '',
        email: ['', Validators.email],
    })
    maxlength: number = 11
    $isLoading = signal<boolean>(false)

    ngOnInit() {
        this.formGroup.patchValue(this.provider)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.$isLoading.set(true)
            this.providersService.update(this.formGroup.value, this.provider.id).subscribe({
                next: provider => {
                    this.$isLoading.set(false)
                    this.dialogRef.close(provider)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.$isLoading.set(false)
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
