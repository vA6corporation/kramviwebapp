import { Component, EventEmitter, Output } from '@angular/core';
import { ModuleModel } from '../module.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BusinessModel } from '../../auth/business.model';
import { OfficeModel } from '../../auth/office.model';
import { UserModel } from '../../users/user.model';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    imports: [MaterialModule, RouterModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.sass',
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
    private handleIsAuth$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
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
