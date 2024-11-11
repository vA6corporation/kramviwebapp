import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {

    constructor(
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly navigationService: NavigationService,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        key: null,
    })
    isAuth: boolean = false
    userName: string = 'User'
    title: string = 'Kramvi'
    showSearch: boolean = false
    showInputSearch: boolean = false
    isLoadBar: boolean = true
    isMainScreen: boolean = false

    @Output()
    sidenavToggle = new EventEmitter<void>()
    @ViewChild('inputKey')
    inputKey!: ElementRef<HTMLInputElement> | null
    menus: any[] = []
    buttons: any[] = []

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
            this.title = title
        })

        this.handleIsMainScreen$ = this.navigationService.handleIsMainScreen().subscribe(isMainScreen => {
            this.isMainScreen = isMainScreen
        })

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            this.isAuth = isAuth
        })

        this.handleIsLoadBar$ = this.navigationService.handleIsLoadBar().subscribe(isLoadBar => {
            this.isLoadBar = isLoadBar
        })

        this.handleShowSearch$ = this.navigationService.handleShowSearch().subscribe(() => {
            this.showInputSearch = true
            setTimeout(() => {
                if (this.inputKey) {
                    this.inputKey.nativeElement.focus()
                }
            })
        })

        this.handleSetMenu$ = this.navigationService.handleSetMenu().subscribe(menus => {
            const filterMenus = []
            const filterButtons = []
            this.showSearch = false
            for (const menu of menus) {
                if (menu.id === 'search') {
                    this.showSearch = true
                    continue
                }
                if (menu.show) {
                    filterButtons.push(menu)
                } else {
                    filterMenus.push(menu)
                }
            }
            this.menus = filterMenus
            this.buttons = filterButtons
        })
    }

    onClickMenu(id: string) {
        if (id === 'search') {
            this.showSearch = !this.showSearch
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
        if (this.showSearch) {
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
            this.showInputSearch = false
        }
    }
}
