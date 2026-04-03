import { Component, inject, signal } from '@angular/core'
import { Subscription } from 'rxjs'
import { NavigationService } from '../../navigation/navigation.service'
import { AuthService } from '../../auth/auth.service'
import { ModuleModel } from '../../navigation/module.model'
import { MaterialModule } from '../../material.module'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-home',
    imports: [MaterialModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent {

    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)

    $modules = signal<ModuleModel[]>([])
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Bienvenido')
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$modules.set(this.authService.getModules())
        })
    }

    onLogout() {
        this.authService.logout()
    }

}
