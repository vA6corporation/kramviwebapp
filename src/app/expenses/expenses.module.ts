import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses/expenses.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ExpensesComponent,
    ],
    imports: [
        CommonModule,
        ExpensesRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
})
export class ExpensesModule { }
