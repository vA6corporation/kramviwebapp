import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../auth.service'
import { BusinessModel } from '../../businesses/business.model'
import { OfficeModel } from '../../offices/office.model'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { MaterialModule } from '../../material.module'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-logout',
    imports: [MaterialModule, CommonModule],
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.sass']
})
export class LogoutComponent {

    private readonly router = inject(Router)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    $user = signal<UserModel>(new UserModel())
    $businesses = signal<BusinessModel[]>([])
    business: BusinessModel = new BusinessModel()
    offices: OfficeModel[] = []

    private handleAuth$: Subscription = new Subscription()
    private handleBusinesses$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleBusinesses$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cerrar sesion')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$user.set(auth.user)
            console.log(auth.user)
            if (auth.user.officeId === null) {
                this.handleBusinesses$ = this.authService.handleBusinesses().subscribe(businesses => {
                    this.$businesses.set(businesses)
                })
            } else {
                this.$businesses.set([])
            }
        })
    }

    onBusinessOfficeSelected(business: BusinessModel, office: OfficeModel) {
        this.authService.setOfficeBusiness(business, office).subscribe(res => {
            this.authService.setAccessToken(res.accessToken)
            this.router.navigate(['']).then(() => {
                location.reload()
            })
        })
    }

    onLogout() {
        this.authService.logout()
    }

}
