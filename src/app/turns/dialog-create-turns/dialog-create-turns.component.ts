import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../../navigation/navigation.service'
import { TurnsService } from '../turns.service'

@Component({
    selector: 'app-dialog-create-turns',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-turns.component.html',
    styleUrl: './dialog-create-turns.component.sass',
})
export class DialogCreateTurnsComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly dialogRef: MatDialogRef<DialogCreateTurnsComponent> = inject(MatDialogRef)
    private readonly turnsService = inject(TurnsService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        openCash: ['', Validators.required]
    })

    ngOnInit(): void {
        this.dialogRef.disableClose = true
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.dialogRef.close()
            const { openCash } = this.formGroup.value
            this.turnsService.create(openCash)
            this.navigationService.showMessage('Caja aperturada')
        }
    }

}
