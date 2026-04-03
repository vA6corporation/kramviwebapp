import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { ModuleModel } from '../../navigation/module.model'
import { NavigationService } from '../../navigation/navigation.service'
import { UserModel } from '../../users/user.model'
import { UsersService } from '../users.service'
import { MaterialModule } from '../../material.module'

@Component({
    selector: 'app-privileges',
    imports: [MaterialModule, RouterModule, ReactiveFormsModule],
    templateUrl: './privileges.component.html',
    styleUrls: ['./privileges.component.sass']
})
export class PrivilegesComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly activatedRoute = inject(ActivatedRoute)
    private readonly navigationService = inject(NavigationService)
    private readonly authService = inject(AuthService)
    private readonly usersService = inject(UsersService)

    formGroup: FormGroup = this.formBuilder.group({
        openBox: false,
        turns: false,
        expenses: false,
        posStandard: false,
        posFood: false,
        deliveries: false,
        proformas: false,
        proformar: false,
        boards: false,
        boardsWaiter: false,
        deletedBoards: false,
        credits: false,
        customers: false,
        products: false,
        inventories: false,
        incidents: false,
        reports: false,
        sales: false,
        carriers: false,
        users: false,
        purchases: false,
        providers: false,
        creditNotes: false,
        remissionGuides: false,
        banks: false,
        paymentOrders: false,
    })
    $modules = signal<ModuleModel[]>([])
    $isLoading = signal<boolean>(false)
    user: UserModel = new UserModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.$modules.set(this.authService.getModules())
            this.usersService.getUserById(this.activatedRoute.snapshot.params['userId']).subscribe(user => {
                this.navigationService.setTitle(`Permisos ${user.name}`)
                this.user = user
                for (const module of this.$modules()) {
                    if (module.name in user.activeModule && user.activeModule[module.name] === true) {
                        this.formGroup.get(module.name)?.setValue(true)
                    }
                }
            })
        })
    }

    onSubmit() {
        this.user.activeModule = this.formGroup.value
        this.$isLoading.set(true)
        this.navigationService.loadBarStart()
        this.usersService.update(this.user, this.user.id).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.navigationService.showMessage('Se han guardado los cambios')
            this.$isLoading.set(false)
            this.navigationService.back()
        }, (error: HttpErrorResponse) => {
            console.log(error)
            this.$isLoading.set(false)
        })
    }

}
