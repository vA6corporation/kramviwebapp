import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
    ) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 || err.status === 403) {
            this.authService.loggedOut()
            this.router.navigate(['/login'])
        }
        throw err
    }

    intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(req).pipe(catchError(err => this.handleAuthError(err)))
    }

}