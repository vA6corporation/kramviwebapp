import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateDueModel } from '../../dues/create-due.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';

export interface DialogDueData {
    turnId: string
    charge: number
    dues: CreateDueModel[]
}

@Component({
    selector: 'app-dialog-dues',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-dues.component.html',
    styleUrls: ['./dialog-dues.component.sass']
})
export class DialogDuesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly data: DialogDueData,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
        private readonly dialogRef: MatDialogRef<DialogDuesComponent>,
    ) { }

    formArray: FormArray = this.formBuilder.array([]);
    formGroup: FormGroup = this.formBuilder.group({
        formArray: this.formArray,
    })

    private handleDues$: Subscription = new Subscription()
    private handleSaleItems$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleDues$.unsubscribe()
        this.handleSaleItems$.unsubscribe()
    }

    ngOnInit(): void {
        for (const due of this.data.dues) {
            const formGroup = this.formBuilder.group({
                charge: [due.charge, Validators.required],
                dueDate: [due.dueDate, Validators.required],
            })
            this.formArray.push(formGroup)
        }

        if (this.formArray.length === 0) {
            const now = new Date()

            const due: CreateDueModel = {
                charge: this.data.charge,
                preCharge: this.data.charge,
                dueDate: new Date(now.setMonth(now.getMonth() + 1)),
            }

            const formGroup = this.formBuilder.group({
                charge: [due.charge, Validators.required],
                dueDate: [due.dueDate, Validators.required],
            })

            this.formArray.push(formGroup)
        }
    }

    onAddDue() {
        const now = new Date()
        const formGroup = this.formBuilder.group({
            charge: [null, Validators.required],
            dueDate: [new Date(now.setMonth(now.getMonth() + 1)), Validators.required],
            paymentType: ['EFECTIVO', Validators.required],
            isPaid: false,
            turnId: this.data.turnId
        })
        this.formArray.push(formGroup)
    }

    onDeleteDue(index: number) {
        this.formArray.removeAt(index)
    }

    onSubmit() {
        try {
            const dues: CreateDueModel[] = this.formArray.value
            const date = new Date()
            date.setHours(0, 0, 0, 0)

            if (dues.find(e => new Date(e.dueDate).getTime() <= date.getTime())) {
                throw new Error('Fecha de pago no puede ser anterior o igual a la fecha de emisión del comprobante')
            }

            if (this.data.turnId === null) {
                throw new Error('Debes aperturar caja')
            }

            if (dues.length === 0) {
                throw new Error('Agrega al menos una cuota')
            }

            if (dues.find((e: CreateDueModel) => e.charge === 0)) {
                throw new Error('No puede haber monto 0')
            }

            const sumDues = dues.map(e => e.charge).reduce((a: number, b: number) => a + b, 0)

            if (Number(sumDues.toFixed(2)) > Number(this.data.charge.toFixed(2))) {
                throw new Error('La suma de cuotas no puede ser mayor al monto total')
            }

            if (this.formArray.valid) {
                this.dialogRef.close(dues)
            }
        } catch (error) {
            if (error instanceof Error) {
                this.navigationService.showMessage(error.message)
            }
        }
    }

    onCancel() {
        this.dialogRef.close()
    }

}
