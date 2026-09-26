import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProgressSpinnerMode } from '@angular/material/progress-spinner'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-progress',
    imports: [MaterialModule],
    templateUrl: './dialog-progress.component.html',
    styleUrls: ['./dialog-progress.component.sass'],
})
export class DialogProgressComponent {

    private readonly length: number = inject(MAT_DIALOG_DATA)
    private readonly matDialogRef = inject(MatDialogRef)

    mode: ProgressSpinnerMode = 'indeterminate'
    $value = signal<number>(0)
    private chunk = 100 / this.length

    ngOnInit(): void {
        this.matDialogRef.disableClose = true
    }

    onComplete() {
        this.mode = 'determinate'
        let value = this.$value()
        value += this.chunk
        if (value >= 100) {
            this.matDialogRef.close()
        }
        this.$value.set(value)
    }

}
