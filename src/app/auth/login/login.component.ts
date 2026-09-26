import { Component, inject, signal } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../auth.service'
import { NavigationService } from '../../navigation/navigation.service'
import { environment } from '../../../environments/environment'
import { MaterialModule } from '../../material.module'

interface UserModel {
    id: number
    name: string
    email: string
    password: string
}

@Component({
    selector: 'app-login',
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent {

    private readonly router = inject(Router)
    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    version: string = environment.version
    loginForm: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        rememberme: false,
    })
    isLoading = signal(false)
    newLogin: boolean = false
    $rememberUsers = signal<UserModel[]>([])
    hide: boolean = true
    private db: IDBDatabase | null = null
    private count = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Kramvi')
        this.loadDb().then(() => {
            this.loadUsers()
        })
        this.navigationService.loadBarFinish()
    }

    onDeploy() {
        if (this.count >= 5) {
            this.router.navigate(['signup'])
        }
        this.count += 1
    }

    loadDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (indexedDB) {
                const request = indexedDB.open('kramvi', 1)
                request.onsuccess = () => {
                    this.db = request.result
                    resolve()
                }

                request.onupgradeneeded = (e) => {
                    this.db = request.result
                    console.log('CREATE', this.db)

                    if (e.oldVersion < 1) {
                        this.db.createObjectStore('rememberUsers', { keyPath: 'id' })
                        this.db.createObjectStore('printers', { keyPath: 'name' })
                    }
                }

                request.onerror = (error) => {
                    console.log('Error', error)
                    reject()
                }
            } else {
                reject()
            }
        })
    }

    updateUser(user: UserModel) {
        const transaction = this.db?.transaction(['rememberUsers'], 'readwrite')
        const objectStore = transaction?.objectStore('rememberUsers')
        objectStore?.put(user)
    }

    onDeleteUser(userId: any, event: MouseEvent) {
        event.stopPropagation()
        const ok = confirm('Esta seguro de eliminar?...')
        if (ok && this.db !== null) {
            const transaction = this.db.transaction(['rememberUsers'], 'readwrite')
            const objectStore = transaction.objectStore('rememberUsers')
            const request = objectStore.delete(userId)
            request.onsuccess = () => {
                this.loadUsers()
            }
        }
    }

    getUser(userId: any): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            if (this.db !== null) {
                const transaction = this.db.transaction(['rememberUsers'], 'readonly')
                const objectStore = transaction.objectStore('rememberUsers')
                const request = objectStore.get(userId)

                request.onsuccess = () => {
                    resolve(request.result)
                }
            }
        })
    }

    loadUsers() {
        if (this.db !== null) {
            const transaction = this.db.transaction(['rememberUsers'], 'readonly')
            const objectStore = transaction.objectStore('rememberUsers')
            const request = objectStore.openCursor()
            const rememberUsers: UserModel[] = []
            request.onsuccess = (e: any) => {
                const cursor = e.target.result
                if (cursor) {
                    rememberUsers.push(cursor.value)
                    cursor.continue()
                } else {
                    this.$rememberUsers.set(rememberUsers)
                }
            }
        }
    }

    onUserSelected(user: UserModel) {
        this.loginForm.patchValue(user)
        this.onSubmit()
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading.set(true)
            this.navigationService.loadBarStart()
            const { email, password, rememberme } = this.loginForm.value
            this.authService.login(email, password).subscribe({
                next: auth => {
                    this.navigationService.loadBarFinish()
                    const {
                        accessToken,
                        business,
                        office,
                        activeModule,
                        setting,
                        user,
                        payload
                    } = auth
                    if (rememberme) {
                        const user: UserModel = {
                            id: payload.userId,
                            name: payload.name,
                            email,
                            password,
                        }
                        this.updateUser(user)
                    }
                    this.isLoading.set(false)
                    this.authService.setAccessToken(accessToken)
                    this.authService.setAuth(user, office, business, setting, activeModule)
                    if (office === null) {
                        this.router.navigate(['/setOffice'])
                    } else {
                        this.authService.loggedIn()
                        this.router.navigate(['/'])
                        this.authService.loggedIn()
                        if (this.authService.isDebtor() <= 0) {
                            this.navigationService.showDialogMessage('Es necesario renovar la suscripcion')
                        }
                    }
                }, error: (error: HttpErrorResponse) => {
                    console.log(error)
                    this.isLoading.set(false)
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Usuario o contraseña incorrectos')
                }
            })
        }
    }
}
