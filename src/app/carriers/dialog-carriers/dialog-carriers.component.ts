import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { CarrierModel } from '../../carriers/carrier.model';
import { CarriersService } from '../../carriers/carriers.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dialog-carriers',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dialog-carriers.component.html',
    styleUrls: ['./dialog-carriers.component.sass'],
})
export class DialogCarriersComponent {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly carriersService: CarriersService,
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogCarriersComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        searchType: 'RUC',
        key: ['', Validators.required],
    })

    carriers: CarrierModel[] = []
    maxlength: number = 11
    searchTypes = [
        { code: 'RUC', label: 'RUC' },
        { code: 'DNI', label: 'DNI' },
        { code: 'NAME', label: 'NOMBRES/TELEFONO' },
    ]
    onAdd = new EventEmitter()
    setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })

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

    handleAddCarrier() {
        return this.onAdd
    }

    onSelectCarrier(customer: CarrierModel) {
        this.dialogRef.close(customer)
    }

    onCreateCarrier() {
        this.onAdd.emit()
    }

    onChangeKey() {
        const searchType = this.formGroup.get('searchType')?.value
        const key = this.formGroup.get('key')?.value
        switch (searchType) {
            case 'RUC':
                if (key.length === 11) {
                    this.formGroup.get('key')?.disable()
                    this.carriersService.getCarriersByRuc(key).subscribe({
                        next: carriers => {
                            this.carriers = carriers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            case 'DNI':
                if (key.length === 8) {
                    this.formGroup.get('key')?.disable()
                    this.carriersService.getCarriersByDni(key).subscribe({
                        next: carriers => {
                            this.carriers = carriers
                            this.formGroup.get('key')?.enable()
                        }, error: (error: HttpErrorResponse) => {
                            this.formGroup.get('key')?.enable()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                }
                break
            default:
                this.formGroup.get('key')?.disable()
                this.carriersService.getCarriersByKey(key).subscribe({
                    next: carriers => {
                        this.carriers = carriers
                        this.formGroup.get('key')?.enable()
                    }, error: (error: HttpErrorResponse) => {
                        this.formGroup.get('key')?.enable()
                        this.navigationService.showMessage(error.error.message)
                    }
                })
                break
        }
    }

}
