import { Component, OnInit } from '@angular/core';
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
    selector: 'app-logout',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.sass']
})
export class LogoutComponent implements OnInit {

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly navigationService: NavigationService,
    ) { }

    user: UserModel = new UserModel()
    business: BusinessModel = new BusinessModel()
    offices: OfficeModel[] = []
    businesses: BusinessModel[] = []

    private handleAuth$: Subscription = new Subscription()
    private handleBusinesses$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
        this.handleBusinesses$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Cerrar sesion')

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user

            this.handleBusinesses$ = this.authService.handleBusinesses().subscribe(businesses => {
                if (this.user.assignedOfficeId === null) {
                    this.businesses = businesses
                }
            })
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
