import { Component, EventEmitter, Output, inject, signal } from '@angular/core'
import { ModuleModel } from '../module.model'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { UserModel } from '../../users/user.model'
import { MaterialModule } from '../../material.module'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-sidenav',
    imports: [MaterialModule, RouterModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.sass',
})
export class SidenavComponent {

    private readonly authService = inject(AuthService)

    @Output()
    sidenavClose = new EventEmitter<void>()
    $modules = signal<ModuleModel[]>([])
    $business = signal<BusinessModel>(new BusinessModel())
    $office = signal<OfficeModel>(new OfficeModel())
    $user = signal<UserModel>(new UserModel())
    isAuth = signal(false)

    private handleAuth$: Subscription = new Subscription()
    private handleIsAuth$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            this.isAuth.set(isAuth)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$business.set(auth.business)
            this.$office.set(auth.office)
            this.$user.set(auth.user)

            this.$modules.set(this.authService.getModules())
        })
    }

    onClose(): void {
        this.sidenavClose.emit()
    }

    onLogout(): void {
        this.authService.logout()
        this.sidenavClose.emit()
    }

}
