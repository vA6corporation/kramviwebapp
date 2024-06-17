import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class CanActivateTeam {

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const auth = this.authService.getAuth();
        if (auth) {
            return auth.modules.find(e => e.name === route.data['routeName'] && e.isAuthorized) ? true : false;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}