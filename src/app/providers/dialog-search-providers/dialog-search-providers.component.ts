import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProvidersService } from '../providers.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ProviderModel } from '../provider.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-search-providers',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-search-providers.component.html',
    styleUrl: './dialog-search-providers.component.sass'
})
export class DialogSearchProvidersComponent {
    
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly providersService: ProvidersService,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogSearchProvidersComponent>,
    ) { }

    providers: ProviderModel[] = []
    formGroup: FormGroup = this.formBuilder.group({
        searchType: 'RUC',
        key: [null, Validators.required],
    })
    maxlength: number = 11
    searchTypes = [
        { code: 'RUC', name: 'RUC' },
        { code: 'DNI', name: 'DNI' },
        { code: 'MOBILE', name: 'CELULAR' },
        { code: 'NAME', name: 'NOMBRES' },
    ]
    isLoading: boolean = false

    private onAdd: EventEmitter<void> = new EventEmitter()

    ngOnInit(): void {
        this.formGroup.get('searchType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxlength = 11
                    break
                case 'DNI':
                    this.formGroup.get('key')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)])
                    this.maxlength = 8
                    break
                default:
                    this.formGroup.get('key')?.setValidators([Validators.required])
                    this.maxlength = 50
            }
            this.formGroup.get('key')?.updateValueAndValidity()
        })
    }

    handleAddProvider() {
        return this.onAdd
    }

    onSelectProvider(provider: ProviderModel) {
        this.dialogRef.close(provider)
    }

    onCreateProvider() {
        this.onAdd.emit()
    }

    onChangeKey() {
        const searchType = this.formGroup.get('searchType')?.value
        const key = this.formGroup.get('key')?.value
        switch (searchType) {
            case 'RUC':
                if (key.length === 11) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.providersService.getProvidersByRuc(key).subscribe(providers => {
                        this.isLoading = false
                        this.providers = providers
                        this.formGroup.get('key')?.enable()
                    }, (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    })
                }
                break
            case 'DNI':
                if (key.length === 8) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.providersService.getProvidersByDni(key).subscribe(provider => {
                        this.isLoading = false
                        this.providers = provider
                        this.formGroup.get('key')?.enable()
                    }, (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    })
                }
                break
            case 'MOBILE':
                if (key.length === 9) {
                    this.formGroup.get('key')?.disable()
                    this.isLoading = true
                    this.providersService.getProvidersByMobile(key).subscribe(provider => {
                        this.isLoading = false
                        this.providers = provider
                        this.formGroup.get('key')?.enable()
                    }, (error: HttpErrorResponse) => {
                        this.isLoading = false
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    })
                }
                break
            default:
                this.formGroup.get('key')?.disable()
                this.isLoading = true
                this.providersService.getProvidersByKey(key).subscribe(provider => {
                    this.isLoading = false
                    this.providers = provider
                    this.formGroup.get('key')?.enable()
                }, (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.formGroup.get('key')?.enable()
                    this.navigationService.showMessage(error.error.message)
                })
                break
        }
    }
}
