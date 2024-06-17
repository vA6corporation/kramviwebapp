import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PrinterModel } from '../printer.model';
import { PrintersService } from '../printers.service';

@Component({
    selector: 'app-dialog-add-printers',
    templateUrl: './dialog-add-printers.component.html',
    styleUrls: ['./dialog-add-printers.component.sass']
})
export class DialogAddPrintersComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly printersService: PrintersService,
        private readonly dialogRef: MatDialogRef<DialogAddPrintersComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required],
        printInvoice: false,
        printAccount: false,
        printKitchen: false,
        printBar: false,
        printOven: false,
        printBox: false,
    })

    ngOnInit(): void {
    }

    onSubmit() {
        const { name, printInvoice, printAccount, printKitchen, printBar, printOven, printBox } = this.formGroup.value
        if (this.formGroup.valid) {
            const ObjectId = (m = Math, d = Date, h = 16, s = (s: any) => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
            const printer: PrinterModel = {
                _id: ObjectId(),
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
