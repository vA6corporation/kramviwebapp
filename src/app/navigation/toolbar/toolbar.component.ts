import { Component, ElementRef, EventEmitter, Output, ViewChild, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Subscription } from 'rxjs'
import { AuthService } from '../../auth/auth.service'
import { MaterialModule } from '../../material.module'
import { NavigationService } from '../navigation.service'

@Component({
    selector: 'app-toolbar',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule],
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.sass'],
})
export class ToolbarComponent {

    private readonly formBuilder = inject(FormBuilder)
    private readonly authService = inject(AuthService)
    private readonly navigationService = inject(NavigationService)

    formGroup: FormGroup = this.formBuilder.group({
        key: null,
    })
    $isAuth = signal<boolean>(false)
    $title = signal<string>('Kramvi')
    $showSearch = signal<boolean>(false)
    $showInputSearch = signal<boolean>(false)
    $isLoadBar = signal<boolean>(true)
    $isMainScreen = signal<boolean>(false)

    @Output()
    sidenavToggle = new EventEmitter<void>()
    @ViewChild('inputKey')
    inputKey!: ElementRef<HTMLInputElement> | null
    $menus = signal<any[]>([])
    $buttons = signal<any[]>([])

    private handleChangeTitle$: Subscription = new Subscription()
    private handleIsMainScreen$: Subscription = new Subscription()
    private handleBackTo$: Subscription = new Subscription()
    private handleIsAuth$: Subscription = new Subscription()
    private handleIsLoadBar$: Subscription = new Subscription()
    private handleShowSearch$: Subscription = new Subscription()
    private handleSetMenu$: Subscription = new Subscription()
    private handleClearSearch$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleChangeTitle$.unsubscribe()
        this.handleIsMainScreen$.unsubscribe()
        this.handleBackTo$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
        this.handleIsLoadBar$.unsubscribe()
        this.handleShowSearch$.unsubscribe()
        this.handleSetMenu$.unsubscribe()
        this.handleClearSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleChangeTitle$ = this.navigationService.handleChangeTitle().subscribe(title => {
            this.$title.set(title)
        })

        this.handleIsMainScreen$ = this.navigationService.handleIsMainScreen().subscribe(isMainScreen => {
            this.$isMainScreen.set(isMainScreen)
        })

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            this.$isAuth.set(isAuth)
        })

        this.handleIsLoadBar$ = this.navigationService.handleIsLoadBar().subscribe(isLoadBar => {
            this.$isLoadBar.set(isLoadBar)
        })

        this.handleShowSearch$ = this.navigationService.handleShowSearch().subscribe(() => {
            this.$showInputSearch.set(true)
            setTimeout(() => {
                if (this.inputKey) {
                    this.inputKey.nativeElement.focus()
                }
            })
        })

        this.handleSetMenu$ = this.navigationService.handleSetMenu().subscribe(menus => {
            const filterMenus = []
            const filterButtons = []
            this.$showSearch.set(false)
            for (const menu of menus) {
                if (menu.id === 'search') {
                    this.$showSearch.set(true)
                    continue
                }
                if (menu.show) {
                    filterButtons.push(menu)
                } else {
                    filterMenus.push(menu)
                }
            }
            this.$menus.set(filterMenus)
            this.$buttons.set(filterButtons)
        })
    }

    onClickMenu(id: string) {
        if (id === 'search') {
            this.$showSearch.set(!this.$showSearch())
        }
        this.navigationService.clickMenu(id)
    }

    onBack() {
        this.navigationService.back()
    }

    onSubmit() {
        const { key } = this.formGroup.value
        this.formGroup.reset()
        if (key) {
            this.navigationService.search(key)
        }
    }

    onToggleSidenav(): void {
        this.sidenavToggle.emit()
    }

    onToggleSearch() {
        if (this.$showSearch()) {
            setTimeout(() => {
                if (this.inputKey) {
                    this.inputKey.nativeElement.focus()
                }
            })
        }
    }

    onCloseInputSearch() {
        if (this.formGroup.value.key) {
            this.formGroup.reset()
        } else {
            this.$showInputSearch.set(false)
        }
    }
}
