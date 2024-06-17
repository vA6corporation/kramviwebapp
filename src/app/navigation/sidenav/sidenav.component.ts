import { Component, EventEmitter, Output } from '@angular/core';
import { ModuleModel } from '../module.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { UserModel } from '../../users/user.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass'
})
export class SidenavComponent {
    
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Output()
    sidenavClose = new EventEmitter<void>()
    modules: ModuleModel[] = []
    business: BusinessModel = new BusinessModel()
    office: OfficeModel = new OfficeModel()
    user: UserModel = new UserModel()
    isAuth: boolean = false

    private handleAuth$: Subscription = new Subscription()
    private handleAuthStatus$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleAuthStatus$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuthStatus$ = this.authService.handleAuthStatus().subscribe(isAuth => {
            this.isAuth = isAuth
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.modules = auth.modules
            this.business = auth.business
            this.office = auth.office
            this.user = auth.user
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