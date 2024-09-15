import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';

interface MenuToolbar {
    id: string
    label: string
    icon: string
    show: boolean
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(
        private readonly matSnackBar: MatSnackBar,
        private readonly router: Router,
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const lastPath = this.history[this.history.length - 1]
                if (lastPath !== event.urlAfterRedirects) {
                    this.history.push(event.urlAfterRedirects)
                }
            }
        })
    }

    private history: string[] = []

    private handleSearch$: EventEmitter<string> = new EventEmitter()
    private handleShowDialogMessage$: EventEmitter<string> = new EventEmitter()
    private handleIsLoadBar$: EventEmitter<boolean> = new EventEmitter()
    private handleChangeTitle$: EventEmitter<string> = new EventEmitter()
    private handleIsMainScreen$: EventEmitter<boolean> = new EventEmitter()
    private handleSetMenu$: EventEmitter<MenuToolbar[]> = new EventEmitter()
    private handleClickMenu$: EventEmitter<string> = new EventEmitter()
    private handleShowSearch$: EventEmitter<void> = new EventEmitter()

    back(): void {
        this.history.pop()
        const lastPath = this.history[this.history.length - 1]
        if (this.history.length > 0) {
            if (lastPath) {
                const url = lastPath.split('?')[0]
                const query = lastPath.split('?')[1] || ''
                const params = query.split('&')
                const queryParams: any = {}
                params.forEach(e => {
                    const pair = e.split('=')
                    queryParams[`${pair[0]}`] = pair[1]
                })
                this.router.navigate([url], { queryParams })
            }
        } else {
            this.router.navigateByUrl("/")
        }
    }

    handleSearch() {
        return this.handleSearch$.asObservable()
    }

    handleClickMenu() {
        return this.handleClickMenu$.asObservable()
    }

    handleShowDialogMessage() {
        return this.handleShowDialogMessage$.asObservable()
    }

    handleShowSearch() {
        return this.handleShowSearch$.asObservable()
    }

    handleSetMenu() {
        return this.handleSetMenu$.asObservable()
    }

    handleIsLoadBar() {
        return this.handleIsLoadBar$.asObservable()
    }

    handleChangeTitle() {
        return this.handleChangeTitle$.asObservable()    
    }

    handleIsMainScreen() {
        return this.handleIsMainScreen$.asObservable()
    }

    clickMenu(id: string) {
        return this.handleClickMenu$.emit(id)
    }

    showSearch() {
        this.handleShowSearch$.emit()
    }

    showDialogMessage(message: string) {
        this.handleShowDialogMessage$.emit(message)
    }

    setMenu(menus: MenuToolbar[]) {
        this.handleSetMenu$.emit(menus)
    }

    search(key: string) {
        return this.handleSearch$.emit(key)
    }

    loadBarStart() {
        this.handleIsLoadBar$.emit(true)
    }

    loadBarFinish() {
        this.handleIsLoadBar$.emit(false)
    }

    showMessage(message: string) {
        this.matSnackBar.open(message, 'Aceptar', {
            duration: 5000,
        })
    }

    setTitle(title: string) {
        this.handleChangeTitle$.emit(title)
    }

    setIsMainScreen(isMainScreen: boolean) {
        this.handleIsMainScreen$.emit(isMainScreen)
    }

}
