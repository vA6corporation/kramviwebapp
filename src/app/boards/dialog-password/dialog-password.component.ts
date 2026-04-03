import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { SettingModel } from '../../settings/setting.model'
import { NavigationService } from '../../navigation/navigation.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-password',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-password.component.html',
    styleUrls: ['./dialog-password.component.sass']
})
export class DialogPasswordComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)
    private readonly dialogRef: MatDialogRef<DialogPasswordComponent>  = inject(MatDialogRef)

    formGroup: FormGroup = this.formBuilder.group({
        password: ['', Validators.required]
    })
    isLoading: boolean = false
    hide: boolean = true
    private setting: SettingModel = new SettingModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const { password } = this.formGroup.value
            if (this.setting.password === password) {
                this.dialogRef.close(true)
            } else {
                this.navigationService.showMessage('Contraseña incorrecta')
            }
        }
    }

}
