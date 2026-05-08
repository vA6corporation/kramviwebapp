import { Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { OfficeModel } from '../../offices/office.model'
import { CdrModel } from '../cdr.model'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-dialog-bad-cdrs',
    imports: [MaterialModule],
    templateUrl: './dialog-bad-cdrs.component.html',
    styleUrls: ['./dialog-bad-cdrs.component.sass']
})
export class DialogBadCdrsComponent {

    readonly badCdrs: CdrModel[] = inject(MAT_DIALOG_DATA)
    private readonly authService = inject(AuthService)

    $office = signal<OfficeModel>(new OfficeModel())

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$office.set(auth.office)
        })
    }

}
