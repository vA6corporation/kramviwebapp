import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.sass']
})
export class SubscriptionComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        this.navigationService.setTitle('Renueve la suscripcion');
        if (!this.authService.isDebtorCancel()) {
            this.router.navigate(['/']);
        }
    }

}
