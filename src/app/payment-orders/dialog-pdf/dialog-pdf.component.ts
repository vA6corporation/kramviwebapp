import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-pdf',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './dialog-pdf.component.html',
    styleUrls: ['./dialog-pdf.component.sass']
})
export class DialogPdfComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly urlPdf: string | null,
        private readonly sanitizer: DomSanitizer,
        private readonly dialogRef: MatDialogRef<DialogPdfComponent>,
    ) { }

    url = this.sanitizer.bypassSecurityTrustResourceUrl('')
    accept: string = 'application/pdf'
    private onDeleteEvent: EventEmitter<void> = new EventEmitter()
    private onUploadEvent: EventEmitter<File> = new EventEmitter()

    ngOnInit() {
        if (this.urlPdf) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(decodeURIComponent(this.urlPdf))
        }
    }

    onDeletePdf() {
        this.onDeleteEvent.next()
    }

    handleDeletePdf() {
        return this.onDeleteEvent
    }

    onFileSelected(files: FileList | null, input: HTMLInputElement) {
        if (files !== null && files[0] !== null) {
            const file: File = files[0]
            input.value = ''
            this.onUploadEvent.next(file)
            this.dialogRef.close()
        }
    }

    handleUploadPdf() {
        return this.onUploadEvent
    }

}





