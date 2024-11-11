import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { ProviderModel } from '../provider.model';
import { ProvidersService } from '../providers.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-find-providers',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-find-providers.component.html',
    styleUrls: ['./dialog-find-providers.component.sass']
})
export class DialogFindProvidersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly providersService: ProvidersService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogFindProvidersComponent>,
    ) { }

    providers: ProviderModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        key: [null, Validators.required],
    })
    maxlength: number = 11
    isLoading: boolean = false

    onSetProvider(provider: ProviderModel) {
        this.dialogRef.close(provider)
    }

    fetchData() {
        if (this.formGroup.valid) {
            this.formGroup.get('key')?.disable()
            this.isLoading = true
            const { key } = this.formGroup.value
            this.providersService.getProvidersByKey(key).subscribe(provider => {
                this.isLoading = false
                this.providers = provider
                this.formGroup.get('key')?.enable()
            }, (error: HttpErrorResponse) => {
                this.isLoading = false
                this.formGroup.get('key')?.enable()
                this.navigationService.showMessage(error.error.message)
            })
        }
    }

}
