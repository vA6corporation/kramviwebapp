import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { ModuleModel } from '../navigation/module.model'
import { UserModel } from '../users/user.model'
import { ActiveModuleModel } from './active-module.model'
import { AuthModel } from './auth.model'
import { BusinessModel } from '../businesses/business.model'
import { OfficeModel } from '../offices/office.model'
import { SettingModel } from '../settings/setting.model'
import { HttpService } from '../http.service'

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private modules: ModuleModel[] = [
        { label: 'Estado de caja', name: 'openBox', path: '/turns/openTurn', isActive: false, isAuthorized: false, icon: 'point_of_sale', info: 'General' },
        { label: 'Punto de venta', name: 'posStandard', path: '/posStandard', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Tiendas' },
        { label: 'Punto de venta', name: 'posFood', path: '/posFood', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes' },
        { label: 'Atencion de cajero', name: 'boards', path: '/boards', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes' },
        { label: 'Atencion de mozos', name: 'boardsWaiter', path: '/boards/waiter', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes' },
        { label: 'Entregas', name: 'deliveries', path: '/deliveries', isActive: false, isAuthorized: false, icon: 'outbox', info: 'Casos especiales' },
        { label: 'Proformar', name: 'proformar', path: '/proformas/posProformas', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Tiendas minimarkets' },
        { label: 'Proformas', name: 'proformas', path: '/proformas', isActive: false, isAuthorized: false, icon: 'check_box', info: 'Tiendas minimarkets' },
        { label: 'Comandas', name: 'deletedBoards', path: '/boards/deletedBoards', isActive: false, isAuthorized: false, icon: 'delete_sweep', info: 'Restaurantes' },
        { label: 'Creditos', name: 'credits', path: '/credits', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'Tiendas minimarkets' },
        { label: 'Clientes', name: 'customers', path: '/customers', isActive: false, isAuthorized: false, icon: 'face', info: 'General' },
        { label: 'Productos', name: 'products', path: '/products', isActive: false, isAuthorized: false, icon: 'shopping_basket', info: 'General' },
        { label: 'Inventario', name: 'inventories', path: '/inventories', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'General' },
        { label: 'Ajustes de inventario', name: 'incidents', path: '/incidents', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'General' },
        { label: 'Cajas cerradas', name: 'turns', path: '/turns', isActive: false, isAuthorized: false, icon: 'archive', info: 'General' },
        { label: 'Gastos', name: 'expenses', path: '/expenses', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'General' },
        { label: 'Reportes', name: 'reports', path: '/reports', isActive: false, isAuthorized: false, icon: 'equalizer', info: 'General' },
        { label: 'Comprobantes', name: 'sales', path: '/sales', isActive: false, isAuthorized: false, icon: 'receipt', info: 'General' },
        { label: 'Notas de credito', name: 'creditNotes', path: '/creditNotes', isActive: false, isAuthorized: false, icon: 'receipt', info: 'General' },
        { label: 'Guias de remision', name: 'remissionGuides', path: '/remissionGuides', isActive: false, isAuthorized: false, icon: 'receipt', info: 'General' },
        { label: 'Transportistas', name: 'carriers', path: '/carriers', isActive: false, isAuthorized: false, icon: 'local_shipping', info: 'Casos especiales' },
        { label: 'Compras', name: 'purchases', path: '/purchases', isActive: false, isAuthorized: false, icon: 'shopping_cart', info: 'General' },
        { label: 'Ordenes de Compra', name: 'purchaseOrders', path: '/purchaseOrders', isActive: false, isAuthorized: false, icon: 'shopping_cart', info: 'General' },
        { label: 'Proveedores', name: 'providers', path: '/providers', isActive: false, isAuthorized: false, icon: 'face', info: 'General' },
        { label: 'Ordenes de Pago', name: 'paymentOrders', path: '/paymentOrders', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'General' },
        { label: 'Cuentas bancarias', name: 'banks', path: '/banks', isActive: false, isAuthorized: false, icon: 'account_balance_wallet', info: 'General' },
        { label: 'Usuarios', name: 'users', path: '/users', isActive: false, isAuthorized: false, icon: 'account_circle', info: 'General' },
        { label: 'Facturador', name: 'biller', path: '/biller', isActive: false, isAuthorized: false, icon: 'star', info: 'General' },
    ]

    private auth: AuthModel | null = null
    private isAuth$: Subject<boolean> = new Subject()
    private offices$: BehaviorSubject<OfficeModel[]> | null = null
    private businesses$: BehaviorSubject<BusinessModel[]> | null = null
    private auth$ = new BehaviorSubject<AuthModel>({
        user: new UserModel(),
        business: new BusinessModel(),
        office: new OfficeModel(),
        setting: new SettingModel(),
        activeModule: {}
    })

    isDebtor() {
        const date = new Date()
        const paymentDate = new Date(this.auth?.business.paymentAt || '')
        date.setHours(0, 0, 0, 0)
        paymentDate.setHours(0, 0, 0, 0)
        const diff = paymentDate.getTime() - date.getTime()
        return diff
    }

    isDebtorCancel() {
        const date = new Date()
        const paymentDate = new Date(this.auth?.business.paymentAt || '')
        date.setHours(0, 0, 0, 0)
        paymentDate.setHours(0, 0, 0, 0)
        const diff = paymentDate.getTime() - date.getTime()
        return diff <= -(8.64e+7 * 9) && new Date().getHours() >= 9
    }

    handleAuth() {
        return this.auth$.asObservable()
    }

    getModules(): ModuleModel[] {
        return JSON.parse(JSON.stringify(this.modules))
    }

    setAuth(
        user: UserModel,
        office: OfficeModel,
        business: BusinessModel,
        setting: SettingModel,
        activeModule: ActiveModuleModel,
    ): void {
        if (activeModule) {
            for (const module of this.modules) {
                if (module.name in activeModule && activeModule[module.name] === true) {
                    module.isActive = true
                    if (module.name in user.activeModule && user.activeModule[module.name] === true) {
                        module.isAuthorized = true
                    }
                    if (user.isAdmin) {
                        module.isAuthorized = true
                    }
                }
            }
        }
        this.auth = {
            user,
            office,
            business,
            setting,
            activeModule,
        }
        this.auth$.next(this.auth)
    }

    setUser(user: UserModel) {
        if (this.auth) {
            this.auth.user = user
        }
    }

    getAuth(): AuthModel | null {
        return this.auth
    }

    handleIsAuth() {
        return this.isAuth$.asObservable()
    }

    loggedIn() {
        this.isAuth$.next(true)
    }

    loggedOut() {
        this.isAuth$.next(false)
    }

    setAccessToken(accessToken: string | null): void {
        this.httpService.accessToken = accessToken
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken)
        } else {
            localStorage.setItem('accessToken', '')
        }
    }

    login(email: string, password: string): Observable<any> {
        return this.httpService.post('auth/login', { email, password })
    }

    signup(business: any, office: any, user: any): Observable<any> {
        return this.httpService.post('signup', { business, office, user })
    }

    logout(): void {
        this.setAccessToken(null)
        location.replace('/login')
    }

    getSession(): Observable<any> {
        return this.httpService.get('auth/profile')
    }

    loadBusiness(businessId: any) {
        return this.httpService.get(`businesses/byId/${businessId}`)
    }

    loadBusinesses(): void {
        this.httpService.get('businesses').subscribe(businesses => {
            if (this.businesses$) {
                this.businesses$.next(businesses)
            }
        })
    }

    loadOffices(): void {
        this.httpService.get('offices').subscribe(offices => {
            if (this.offices$) {
                this.offices$.next(offices)
            }
        })
    }

    handleOffices(): Observable<OfficeModel[]> {
        if (this.offices$ === null) {
            this.offices$ = new BehaviorSubject<OfficeModel[]>([])
            this.loadOffices()
        }
        return this.offices$.asObservable()
    }

    handleBusinesses(): Observable<BusinessModel[]> {
        if (this.businesses$ === null) {
            this.businesses$ = new BehaviorSubject<BusinessModel[]>([])
            this.loadBusinesses()
        }
        return this.businesses$.asObservable()
    }

   // setAuthOffice(office: OfficeModel) {
   //     if (this.auth) {
   //         this.auth.office = office
   //         this.auth.setting = office.setting
   //         const activeModule = office.activeModule
   //         const modules: ModuleModel[] = []
   //         for (const module of this.modules) {
   //             if (module.name in activeModule && activeModule[module.name] === true) {
   //                 module.isActive = true
   //                 if (module.name in this.auth.user.privileges && this.auth.user.privileges[module.name] === true) {
   //                     module.isAuthorized = true
   //                 }
   //                 if (this.auth.user.isAdmin) {
   //                     module.isAuthorized = true
   //                 }
   //                 modules.push(module)
   //             }
   //         }
   //         this.auth.activeModule = activeModule
   //         this.auth$.next(this.auth)
   //     }
   // }

    setAuthBusinessOffice(business: BusinessModel, office: OfficeModel) {
        if (this.auth) {
            this.auth.business = business
            this.auth.office = office
            this.auth.setting = office.setting
            this.auth.activeModule = office.activeModule
            const activeModules = office.activeModule
            for (const module of this.modules) {
                if (module.name in activeModules && activeModules[module.name] === true) {
                    module.isActive = true
                    if (module.name in this.auth.user.activeModule && this.auth.user.activeModule[module.name] === true) {
                        module.isAuthorized = true
                    }
                    if (this.auth.user.isAdmin) {
                        module.isAuthorized = true
                    }
                }
            }
            this.auth$.next(this.auth)
        }
    }

    setOffice(office: OfficeModel) {
        return this.httpService.get(`auth/setOffice/${office.id}/${office.activityId}`)
    }

    setOfficeBusiness(business: BusinessModel, office: OfficeModel) {
        return this.httpService.get(`auth/setBusinessOffice/${business.id}/${office.id}/${office.activityId}`)
    }

    setActiveModule(
        activeModules: ActiveModuleModel,
        user: UserModel,
    ): void {
        const modules: ModuleModel[] = []
        for (const module of this.modules) {
            if (module.name in activeModules && activeModules[module.name] === true) {
                module.isActive = true
                if (module.name in user.activeModule && user.activeModule[module.name] === true) {
                    module.isAuthorized = true
                }
                if (user.isAdmin) {
                    module.isAuthorized = true
                }
                modules.push(module)
            }
        }
    }

}
