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
    selector: 'app-set-office',
    imports: [MaterialModule, CommonModule],
    templateUrl: './set-office.component.html',
    styleUrls: ['./set-office.component.sass']
})
export class SetOfficeComponent {

    private readonly router = inject(Router)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    offices: OfficeModel[] = []
    $businesses = signal<BusinessModel[]>([])
    $user = signal<UserModel>(new UserModel())
    business: BusinessModel = new BusinessModel()

    private handleAuth$: Subscription = new Subscription()
    private handleBusinesses$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleBusinesses$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Sucursales')

        this.handleBusinesses$ = this.authService.handleBusinesses().subscribe(businesses => {
            this.$businesses.set(businesses)
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$user.set(auth.user)
        })
    }

    onBusinessOfficeSelected(business: BusinessModel, office: OfficeModel) {
        this.authService.setOfficeBusiness(business, office).subscribe(res => {
            this.authService.setAccessToken(res.accessToken)
            this.authService.setAuthBusinessOffice(business, office)
            this.authService.loggedIn()
            this.router.navigate(['/'])
        })
    }

    onLogout() {
        this.authService.logout()
    }

}
