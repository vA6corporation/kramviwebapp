import { Component, signal } from '@angular/core'
import { MaterialModule } from './material.module'
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { NavigationService } from './navigation/navigation.service'
import { AuthService } from './auth/auth.service'
import { ToolbarComponent } from './navigation/toolbar/toolbar.component'
import { SidenavComponent } from './navigation/sidenav/sidenav.component'
import { HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog'
import { DialogMessageComponent } from './auth/dialog-message/dialog-message.component'
import { PrintIframeComponent } from './print/print-iframe/print-iframe.component'

@Component({
    selector: 'app-root',
    imports: [
        SidenavComponent,
        ToolbarComponent,
        PrintIframeComponent,
        RouterOutlet,
        MaterialModule,
    ],
    templateUrl: './app.html',
    styleUrl: './app.sass'
})
export class App {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
    ) { }

    $isStart = signal<boolean>(false)
    $isOffline = signal<boolean>(false)
    isAuth: boolean = false
    currentPath: string = ''
    private mainScreens = [
        '/',
        '/turns/openTurn',
        '/posStandard',
        '/posFood',
        '/boards',
        '/boards/waiter',
        '/dashboard',
        '/proformas/posProformas',
        '/proformas',
        '/boards/deletedBoards',
        '/credits',
        '/customers',
        '/products',
        '/inventories',
        '/incidents',
        '/turns',
        '/expenses',
        '/reports',
        '/sales',
        '/remissionGuides',
        '/carriers',
        '/purchases',
        '/providers',
        '/purchaseOrders',
        '/paymentOrders',
        '/banks',
        '/users',
        '/biller',
        '/subscription',
        '/settings',
        '/logout',
        '/login'
    ]

    ngOnInit() {
        window.addEventListener('online', () => this.$isOffline.set(false))
        window.addEventListener('offline', () => this.$isOffline.set(true))
        this.$isStart.set(true)

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
                    this.$isStart.set(true)
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
                            this.$isStart.set(true)
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
                            this.$isStart.set(true)
                            this.authService.loggedIn()
                            if (this.authService.isDebtor() <= 0) {
                                this.navigationService.showDialogMessage('Es necesario renovar la suscripcion')
                            }
                        }, error: () => {
                            this.router.navigate(['/login'])
                            this.navigationService.loadBarFinish()
                            this.$isStart.set(true)
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
