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
        private router: Router,
        private readonly matSnackBar: MatSnackBar
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
    private loadBarState$: EventEmitter<boolean> = new EventEmitter()
    private changeTitle$: EventEmitter<string> = new EventEmitter()
    private isMainScreen$: EventEmitter<boolean> = new EventEmitter()
    private setMenu$: EventEmitter<MenuToolbar[]> = new EventEmitter()
    private onClickMenu$: EventEmitter<string> = new EventEmitter()
    private showSearch$: EventEmitter<void> = new EventEmitter()

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
        return this.onClickMenu$.asObservable()
    }

    handleShowDialogMessage() {
        return this.handleShowDialogMessage$.asObservable()
    }

    handleShowSearch() {
        return this.showSearch$.asObservable()
    }

    handleSetMenu() {
        return this.setMenu$.asObservable()
    }

    handleLoadBar() {
        return this.loadBarState$.asObservable()
    }

    handleChangeTitle() {
        return this.changeTitle$.asObservable()
    }

    handleIsMainScreen() {
        return this.isMainScreen$.asObservable()
    }

    clickMenu(id: string) {
        return this.onClickMenu$.emit(id)
    }

    showSearch() {
        this.showSearch$.emit()
    }

    showDialogMessage(message: string) {
        this.handleShowDialogMessage$.emit(message)
    }

    setMenu(menus: MenuToolbar[]) {
        this.setMenu$.emit(menus)
    }

    search(key: string) {
        return this.handleSearch$.emit(key)
    }

    loadBarStart() {
        this.loadBarState$.emit(true)
    }

    loadBarFinish() {
        this.loadBarState$.emit(false)
    }

    showMessage(message: string) {
        this.matSnackBar.open(message, 'Aceptar', {
            duration: 5000,
        })
    }

    setTitle(title: string) {
        this.changeTitle$.emit(title)
        document.title = title
    }

    setIsMainScreen(isMainScreen: boolean) {
        this.isMainScreen$.emit(isMainScreen)
    }

}
