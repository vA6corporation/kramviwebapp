import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DialogProgressComponent } from './dialog-progress/dialog-progress.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [
        ToolbarComponent,
        DialogProgressComponent,
        SidenavComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
    ],
    exports: [
        ToolbarComponent,
        SidenavComponent
    ]
})
export class NavigationModule { }
