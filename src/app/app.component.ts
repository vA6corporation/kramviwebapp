import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { NavigationModule } from './navigation/navigation.module';
import { PrintModule } from './print/print.module';
import { NavigationService } from './navigation/navigation.service';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogMessageComponent } from './auth/dialog-message/dialog-message.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        MaterialModule,
        NavigationModule,
        PrintModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
    ) { }

    isStart: boolean = false
    isAuth: boolean = false
    title: string = 'Kramvi'
    currentPath: string = ''
    isOffline: boolean = false
    private mainScreens = [
        '/',
        '/turns/openTurn',
        '/posStandard',
        '/posFastFood',
        '/boards',
        '/boards/waiter',
        '/preSales',
        '/receptions',
        '/rooms',
        '/deliveries',
        '/dashboard',
        '/proformas/create',
        '/proformas',
        '/boards/deletedBoards',
        '/credits',
        '/customers',
        '/products',
        '/promotions',
        '/coupons',
        '/inventories',
        '/lots',
        '/incidents',
        '/moves',
        '/events',
        '/patients',
        '/turns',
        '/expenses',
        '/specialties',
        '/workers',
        '/reports',
        '/invoices/check',
        '/invoices',
        '/remissionGuides',
        '/carriers',
        '/recipes',
        '/supplies',
        '/inventorySupplies',
        '/purchaseSupplies',
        '/purchases',
        '/providers',
        '/purchaseOrders',
        '/paymentOrders',
        '/banks',
        '/users',
        '/biller',
        '/subscription',
        '/settings',
        '/logout'
    ]

    ngOnInit(): void {
        window.addEventListener('online', () => this.isOffline = false)
        window.addEventListener('offline', () => this.isOffline = true)
        const urlParams = new URLSearchParams(window.location.search)
        const kvtoken = urlParams.get('kvtoken')
        const accessToken = kvtoken || localStorage.getItem('accessToken')

        this.authService.handleIsAuth().subscribe(isAuth => {
            this.isAuth = isAuth
        })

        const $events = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                $events.unsubscribe()
                const queryParams = this.activatedRoute.snapshot.queryParams
                if (queryParams['email'] && queryParams['password']) {
                    this.isStart = true
                    this.authService.login(queryParams['email'], queryParams['password']).subscribe({
                        next: auth => {
                            const {
                                accessToken,
                                business,
                                office,
                                activeModule,
                                setting,
                                user,
                            } = auth
                            this.authService.setAccessToken(accessToken)
                            this.authService.setAuth(user, office, business, setting, activeModule)
                            this.navigationService.loadBarFinish()
                            this.router.navigate(['/setOffice'])
                        }, error: (error: HttpErrorResponse) => {
                            this.isStart = true
                            this.navigationService.loadBarFinish()
                            this.navigationService.showMessage(error.error.message)
                        }
                    })
                } else {
                    this.authService.setAccessToken(accessToken)
                    this.authService.getSession().subscribe({
                        next: auth => {
                            const { business, office, activeModule, setting, user } = auth
                            this.authService.setAuth(user, office, business, setting, activeModule)
                            this.navigationService.loadBarFinish()
                            this.isStart = true
                            this.authService.loggedIn()
                            if (this.authService.isDebtor() <= 0) {
                                this.navigationService.showDialogMessage('Es necesario renovar la suscripcion')
                            }
                        }, error: () => {
                            this.router.navigate(['/login'])
                            this.navigationService.loadBarFinish()
                            this.isStart = true
                        }
                    })
                }
            }
        })

        this.navigationService.handleShowDialogMessage().subscribe(message => {
            this.matDialog.open(DialogMessageComponent, {
                width: '600px',
                position: { top: '20px' },
                data: message,
            })
        })

        this.router.events.forEach(event => {
            if (event instanceof NavigationEnd) {
                if (this.currentPath !== this.router.url.split('?')[0]) {
                    this.navigationService.setMenu([])
                    if (this.mainScreens.includes(this.router.url.split('?')[0])) {
                        this.navigationService.setIsMainScreen(true)
                    } else {
                        this.navigationService.setIsMainScreen(false)
                    }
                }
                this.currentPath = this.router.url.split('?')[0]
            }
        })
    }
}
