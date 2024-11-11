import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { BusinessModel } from '../business.model';
import { OfficeModel } from '../office.model';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-set-office',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './set-office.component.html',
    styleUrls: ['./set-office.component.sass']
})
export class SetOfficeComponent {

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
    ) { }

    offices: OfficeModel[] = []
    businesses: BusinessModel[] = []
    user: UserModel = new UserModel()
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
            this.businesses = businesses
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
        })
    }

    onBusinessOfficeSelected(business: BusinessModel, office: OfficeModel) {
        this.authService.setOfficeBusiness(business, office).subscribe(res => {
            this.authService.setAccessToken(res.accessToken)
            this.authService.setAuthBusinessOffice(business, office)
            this.authService.loggedIn()
            this.router.navigate(['/']).then(() => {
            })
        })
    }

    onLogout() {
        this.authService.logout()
    }

}
