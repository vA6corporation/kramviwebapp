import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-dialog-progress',
    templateUrl: './dialog-progress.component.html',
    styleUrls: ['./dialog-progress.component.sass'],
    standalone: false
})
export class DialogProgressComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly length: number,
        private readonly matDialogRef: MatDialogRef<DialogProgressComponent>
    ) { }

    mode: ProgressSpinnerMode = 'indeterminate'
    value = 0
    private chunk = 100 / this.length

    ngOnInit(): void {
        this.matDialogRef.disableClose = true
    }

    onComplete() {
        this.mode = 'determinate'
        this.value += this.chunk
        if (this.value >= 100) {
            this.matDialogRef.close()
        }
    }

}
