import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { PrinterModel } from '../printer.model'
import { PrintersService } from '../printers.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-add-printers',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-add-printers.component.html',
    styleUrls: ['./dialog-add-printers.component.sass'],
})
export class DialogAddPrintersComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly printersService = inject(PrintersService)
    private readonly dialogRef: MatDialogRef<DialogAddPrintersComponent>= inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        printInvoice: false,
        printAccount: false,
        printKitchen: false,
        printBar: false,
        printOven: false,
        printBox: false,
    })

    onSubmit() {
        const { name, printInvoice, printAccount, printKitchen, printBar, printOven, printBox } = this.formGroup.value
        if (this.formGroup.valid) {
            const ObjectId = (m = Math, d = Date, h = 16, s = (s: any) => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
            const printer: PrinterModel = {
                id: ObjectId(),
                name,
                printInvoice,
                printAccount,
                printKitchen,
                printBar,
                printOven,
                printBox
            }
            this.printersService.putPrinter(printer)
            this.dialogRef.close()
        }
    }

}
