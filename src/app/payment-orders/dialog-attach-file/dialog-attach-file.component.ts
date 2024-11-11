import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-attach-file',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-attach-file.component.html',
    styleUrls: ['./dialog-attach-file.component.sass']
})
export class DialogAttachFileComponent {

    constructor(
        private readonly dialogRef: MatDialogRef<DialogAttachFileComponent>,
    ) { }

    accept: string = 'application/pdf'
    isLoading: boolean = false

    onFileSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            this.dialogRef.close(file)
        }
    }

}
