import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../material.module';

interface UserModel {
    _id: string
    name: string
    email: string
    password: string
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
    ) { }

    version: string = environment.version
    loginForm: FormGroup = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(3)]],
        rememberme: false,
    })
    isLoading: boolean = false
    newLogin: boolean = false
    rememberUsers: UserModel[] = []
    hide: boolean = true
    private db: IDBDatabase | null = null
    private count = 0

    ngOnInit(): void {
        this.navigationService.setTitle('Kramvi')
        this.loadDb().then(() => {
            this.loadUsers()
        })
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
                const request = indexedDB.open('kramvi', 2)
                request.onsuccess = () => {
                    this.db = request.result
                    resolve()
                }

                request.onupgradeneeded = (e) => {
                    this.db = request.result
                    console.log('CREATE', this.db)
                    if (e.oldVersion < 1) {
                        this.db.createObjectStore('rememberUsers', { keyPath: '_id' })
                    }

                    if (e.oldVersion < 2) {
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

    onDeleteUser(userId: string, event: MouseEvent) {
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

    getUser(userId: string): Promise<UserModel> {
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
                    this.rememberUsers = rememberUsers
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
            this.isLoading = true
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
                            _id: payload.userId,
                            name: payload.name,
                            email,
                            password,
                        }
                        this.updateUser(user)
                    }
                    this.isLoading = false
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
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Usuario o contraseña incorrectos')
                }
            })
        }
    }
}
