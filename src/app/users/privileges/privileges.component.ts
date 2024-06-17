import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ModuleModel } from '../../navigation/module.model';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-privileges',
    templateUrl: './privileges.component.html',
    styleUrls: ['./privileges.component.sass']
})
export class PrivilegesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private readonly activatedRoute: ActivatedRoute,
    ) { }

    formGroup: FormGroup = this.formBuilder.group(this.authService.getObjectModules());
    modules: ModuleModel[] = [];
    user: UserModel = new UserModel();
    isLoading: boolean = false;

    private handleAuth$: Subscription = new Subscription();

    ngOnDestroy() {
        this.handleAuth$.unsubscribe();
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.modules = auth.modules;
            this.usersService.getUserById(this.activatedRoute.snapshot.params['userId']).subscribe(user => {
                this.navigationService.setTitle(`Permisos ${user.name}`);
                this.user = user;
                for (const module of this.modules) {
                    if (module.name in user.privileges && user.privileges[module.name] === true)
                        this.formGroup.get(module.name)?.setValue(true);
                }
            });
        });
    }

    onSubmit() {
        this.user.privileges = this.formGroup.value;
        this.isLoading = true;
        this.navigationService.loadBarStart();
        this.usersService.update(this.user, this.user._id).subscribe(() => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage('Se han guardado los cambios');
            this.isLoading = false;
        }, (error: HttpErrorResponse) => {
            console.log(error);
            this.isLoading = false;
        });
    }

}
