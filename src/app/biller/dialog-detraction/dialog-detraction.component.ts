import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { DetractionForm } from '../detraction.form';
import { DetractionModel } from '../detraction.model';

@Component({
  selector: 'app-dialog-detraction',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-detraction.component.html',
  styleUrl: './dialog-detraction.component.sass'
})
export class DialogDetractionComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly detraction: DetractionModel | null,
        private readonly matDialogRef: MatDialogRef<DialogDetractionComponent>
    ) { }

    formGroup = new FormGroup<DetractionForm>({
        serviceCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
        bankAccountNumber: new FormControl('', { nonNullable: true, validators: Validators.required }),
        paymentCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
        percent: new FormControl(null, { nonNullable: true, validators: Validators.required }),
        amount: new FormControl(null, { nonNullable: true, validators: Validators.required })
    })

    paymentMethods: any[] = [
        { name: 'DEPÓSITO EN CUENTA', code: '001' },
        { name: 'GIRO', code: '002' },
        { name: 'TRANSFERENCIA DE FONDOS', code: '003' },
        { name: 'ORDEN DE PAGO', code: '004' },
        { name: 'TARJETA DE DÉBITO', code: '005' }
    ]

    services: any[] = [
        { name: 'Azúcar', code: '001' },
        { name: 'Alcohol etílico', code: '003' },
        { name: 'Recursos hidrobiológicos', code: '004' },
        { name: 'Maíz amarillo duro', code: '005' },
        { name: 'Algodón', code: '006' },
        { name: 'Caña de azúcar', code: '007' },
        { name: 'Madera', code: '008' },
        { name: 'Arena y piedra', code: '009' },
        { name: 'Residuos, subproductos, desechos, recortes y desperdicios', code: '010' },
        { name: 'Bienes del inciso A) del Apéndice I de la Ley del IGV', code: '011' },
        { name: 'Intermediación laboral y tercerización', code: '012' },
        { name: 'Animales vivos', code: '013' },
        { name: 'Carnes y despojos comestibles', code: '014' },
        { name: 'Abonos, cueros y pieles de origen animal', code: '015' },
        { name: 'Aceite de pescado', code: '016' }
    ]

    ngOnInit() {
        if (this.detraction) {
            this.formGroup.patchValue(this.detraction)
        }
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.matDialogRef.close(this.formGroup.value)
        }
    }

}
