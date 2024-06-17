import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SetOfficeComponent } from './set-office/set-office.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'setOffice', component: SetOfficeComponent },
    { path: 'signup', component: SignupComponent },
];

// @NgModule({
//     imports: [RouterModule.forChild(routes)]
// })
// export class AuthRoutes { }