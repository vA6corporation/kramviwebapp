import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ModuleModel } from '../navigation/module.model';
import { UserModel } from '../users/user.model';
import { ActiveModuleModel } from './active-module.model';
import { AuthModel } from './auth.model';
import { BusinessModel } from './business.model';
import { OfficeModel } from './office.model';
import { SettingModel } from './setting.model';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private modules: ModuleModel[] = [
        { label: 'Estado de caja', name: 'openBox', path: '/turns/openTurn', isActive: false, isAuthorized: false, icon: 'point_of_sale', info: 'General' },
        { label: 'Punto de venta', name: 'posStandard', path: '/posStandard', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Tiendas Minimarkets' },
        { label: 'Punto de venta', name: 'posFastFood', path: '/posFastFood', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes FastFood' },
        { label: 'Atencion de mesas', name: 'boards', path: '/boards', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes (Cajero)' },
        { label: 'Atencion de mesas', name: 'boardsWaiter', path: '/boards/waiter', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Restaurantes (Mozos)' },
        { label: 'Pre Ventas', name: 'preSales', path: '/preSales', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Casos especiales' },
        { label: 'Recepcion', name: 'receptions', path: '/receptions', isActive: false, isAuthorized: false, icon: 'login', info: 'Hoteles' },
        { label: 'Habitaciones', name: 'rooms', path: '/rooms', isActive: false, isAuthorized: false, icon: 'sensor_door', info: 'Hoteles' },
        { label: 'Entregas', name: 'deliveries', path: '/deliveries', isActive: false, isAuthorized: false, icon: 'outbox', info: 'Casos especiales' },
        { label: 'Dashboard', name: 'dashboard', path: '/dashboard', isActive: false, isAuthorized: false, icon: 'space_dashboard', info: 'Tiendas minimarkets' },
        { label: 'Proformar', name: 'proformar', path: '/proformas/create', isActive: false, isAuthorized: false, icon: 'desktop_windows', info: 'Tiendas minimarkets' },
        { label: 'Proformas', name: 'proformas', path: '/proformas', isActive: false, isAuthorized: false, icon: 'check_box', info: 'Tiendas minimarkets' },
        { label: 'Comandas', name: 'deletedBoards', path: '/boards/deletedBoards', isActive: false, isAuthorized: false, icon: 'delete_sweep', info: 'Restaurantes' },
        { label: 'Creditos', name: 'credits', path: '/credits', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'Tiendas minimarkets' },
        { label: 'Clientes', name: 'customers', path: '/customers', isActive: false, isAuthorized: false, icon: 'face', info: 'General' },
        { label: 'Productos', name: 'products', path: '/products', isActive: false, isAuthorized: false, icon: 'shopping_basket', info: 'General' },
        { label: 'Promociones', name: 'promotions', path: '/promotions', isActive: false, isAuthorized: false, icon: 'local_offer', info: 'Tiendas minimarkets' },
        { label: 'Cupones', name: 'coupons', path: '/coupons', isActive: false, isAuthorized: false, icon: 'sell', info: 'Tiendas minimarkets' },
        { label: 'Inventario', name: 'inventories', path: '/inventories', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'General' },
        { label: 'Lotes', name: 'lots', path: '/lots', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'General' },
        { label: 'Incidencias', name: 'incidents', path: '/incidents', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'General' },
        { label: 'Traspasos', name: 'moves', path: '/moves', isActive: false, isAuthorized: false, icon: 'check_circle', info: 'Casos especiales' },
        { label: 'Agenda', name: 'events', path: '/events', isActive: false, isAuthorized: false, icon: 'event', info: 'Centro medico' },
        { label: 'H.C. General', name: 'generals', path: '/generals', isActive: false, isAuthorized: false, icon: 'health_and_safety', info: 'Centro medico' },
        { label: 'H.C. Podologia', name: 'podiatries', path: '/podiatries', isActive: false, isAuthorized: false, icon: 'health_and_safety', info: 'Centro medico' },
        { label: 'Pacientes', name: 'patients', path: '/patients', isActive: false, isAuthorized: false, icon: 'account_box', info: 'Centro medico' },
        { label: 'Cajas cerradas', name: 'turns', path: '/turns', isActive: false, isAuthorized: false, icon: 'archive', info: 'General' },
        { label: 'Gastos', name: 'expenses', path: '/expenses', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'General' },
        { label: 'Especialidades', name: 'specialties', path: '/specialties', isActive: false, isAuthorized: false, icon: 'done', info: 'Centro medico' },
        { label: 'Personal', name: 'workers', path: '/workers', isActive: false, isAuthorized: false, icon: 'people', info: 'Casos especialies' },
        { label: 'Reportes', name: 'reports', path: '/reports', isActive: false, isAuthorized: false, icon: 'equalizer', info: 'General' },
        { label: 'Ventas', name: 'invoicesCheck', path: '/invoices/check', isActive: false, isAuthorized: false, icon: 'receipt', info: 'Casos especiales' },
        { label: 'Comprobantes', name: 'invoices', path: '/invoices', isActive: false, isAuthorized: false, icon: 'receipt', info: 'General' },
        { label: 'Guias de remision', name: 'remissionGuides', path: '/remissionGuides', isActive: false, isAuthorized: false, icon: 'receipt', info: 'Casos especiales' },
        { label: 'Transportistas', name: 'carriers', path: '/carriers', isActive: false, isAuthorized: false, icon: 'local_shipping', info: 'Casos especiales' },
        { label: 'Recetas', name: 'recipes', path: '/recipes', isActive: false, isAuthorized: false, icon: 'soup_kitchen', info: 'Restaurantes' },
        { label: 'Insumos', name: 'supplies', path: '/supplies', isActive: false, isAuthorized: false, icon: 'kitchen', info: 'Restaurantes' },
        { label: 'Inventario de Insumos', name: 'inventorySupplies', path: '/inventorySupplies', isActive: false, isAuthorized: false, icon: 'kitchen', info: 'Restaurantes' },
        { label: 'Compras de Insumos', name: 'purchaseSupplies', path: '/purchaseSupplies', isActive: false, isAuthorized: false, icon: 'kitchen', info: 'Restaurantes' },
        { label: 'Compras', name: 'purchases', path: '/purchases', isActive: false, isAuthorized: false, icon: 'shopping_cart', info: 'General' },
        { label: 'Proveedores', name: 'providers', path: '/providers', isActive: false, isAuthorized: false, icon: 'face', info: 'General' },
        { label: 'Ordenes de Compra', name: 'purchaseOrders', path: '/purchaseOrders', isActive: false, isAuthorized: false, icon: 'shopping_cart', info: 'General' },
        { label: 'Ordenes de Pago', name: 'paymentOrders', path: '/paymentOrders', isActive: false, isAuthorized: false, icon: 'local_atm', info: 'General' },
        { label: 'Cuentas bancarias', name: 'banks', path: '/banks', isActive: false, isAuthorized: false, icon: 'account_balance_wallet', info: 'General' },
        { label: 'Usuarios', name: 'users', path: '/users', isActive: false, isAuthorized: false, icon: 'account_circle', info: 'General' },
        { label: 'Facturador', name: 'biller', path: '/biller', isActive: false, isAuthorized: false, icon: 'star', info: 'General' },
    ]

    private objectModules = {
        openBox: false,
        dashboard: false,
        turns: false,
        expenses: false,
        posStandard: false,
        posFastFood: false,
        receptions: false,
        rooms: false,
        deliveries: false,
        proformas: false,
        proformar: false,
        deletedBoards: false,
        boards: false,
        boardsWaiter: false,
        credits: false,
        customers: false,
        products: false,
        promotions: false,
        coupons: false,
        inventories: false,
        lots: false,
        inventorySupplies: false,
        incidents: false,
        moves: false,
        events: false,
        generals: false,
        podiatries: false,
        patients: false,
        reports: false,
        invoices: false,
        carriers: false,
        users: false,
        recipes: false,
        supplies: false,
        purchases: false,
        providers: false,
        purchaseOrders: false,
        purchaseSupplies: false,
        remissionGuides: false,
        specialties: false,
        workers: false,
        biller: false,
        banks: false,
        invoicesCheck: false,
        paymentOrders: false,
        preSales: false,
    }

    private auth: AuthModel | null = null
    private isAuth$: Subject<boolean> = new Subject()
    private offices$: BehaviorSubject<OfficeModel[]> | null = null
    private businesses$: BehaviorSubject<BusinessModel[]> | null = null
    private auth$ = new BehaviorSubject<AuthModel>({
        user: new UserModel(),
        business: new BusinessModel(),
        office: new OfficeModel(),
        setting: new SettingModel(),
        modules: []
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

    getObjectModules() {
        return this.objectModules
    }

    handleAuth() {
        return this.auth$.asObservable()
    }

    setAuth(
        user: UserModel,
        office: OfficeModel,
        business: BusinessModel,
        setting: SettingModel,
        activeModules: ActiveModuleModel,
    ): void {
        const modules: ModuleModel[] = []
        if (activeModules) {
            for (const module of this.modules) {
                if (module.name in activeModules && activeModules[module.name] === true) {
                    module.isActive = true
                    if (module.name in user.privileges && user.privileges[module.name] === true) {
                        module.isAuthorized = true
                    }
                    if (user.isAdmin) {
                        module.isAuthorized = true
                    }
                    modules.push(module)
                }
            }
        }
        this.auth = {
            user,
            office,
            business,
            setting,
            modules
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
        location.reload()
    }

    getSession(): Observable<any> {
        return this.httpService.get('auth/profile')
    }

    loadBusiness(businessId: string) {
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

    setAuthOffice(office: OfficeModel) {
        if (this.auth) {
            this.auth.office = office
            this.auth.setting = office.setting
            const activeModules = office.activeModule
            const modules: ModuleModel[] = []
            for (const module of this.modules) {
                if (module.name in activeModules && activeModules[module.name] === true) {
                    module.isActive = true
                    if (module.name in this.auth.user.privileges && this.auth.user.privileges[module.name] === true) {
                        module.isAuthorized = true
                    }
                    if (this.auth.user.isAdmin) {
                        module.isAuthorized = true
                    }
                    modules.push(module)
                }
            }
            this.auth.modules = modules
            this.auth$.next(this.auth)
        }
    }

    setAuthBusinessOffice(business: BusinessModel, office: OfficeModel) {
        if (this.auth) {
            this.auth.business = business
            this.auth.office = office
            this.auth.setting = office.setting
            const activeModules = office.activeModule
            const modules: ModuleModel[] = []
            for (const module of this.modules) {
                if (module.name in activeModules && activeModules[module.name] === true) {
                    module.isActive = true
                    if (module.name in this.auth.user.privileges && this.auth.user.privileges[module.name] === true) {
                        module.isAuthorized = true
                    }
                    if (this.auth.user.isAdmin) {
                        module.isAuthorized = true
                    }
                    modules.push(module)
                }
            }
            this.auth.modules = modules
            this.auth$.next(this.auth)
        }
    }

    setOffice(office: OfficeModel) {
        return this.httpService.get(`auth/setOffice/${office._id}/${office.activityId}`)
    }

    setOfficeBusiness(business: BusinessModel, office: OfficeModel) {
        return this.httpService.get(`auth/setBusinessOffice/${business._id}/${office._id}/${office.activityId}`)
    }

    getModules(): ModuleModel[] {
        return this.modules
    }

    setActiveModule(
        activeModules: ActiveModuleModel,
        user: UserModel,
    ): void {
        const modules: ModuleModel[] = []
        for (const module of this.modules) {
            if (module.name in activeModules && activeModules[module.name] === true) {
                module.isActive = true
                if (module.name in user.privileges && user.privileges[module.name] === true) {
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
