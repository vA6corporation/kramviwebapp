import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-create-categories',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-create-categories.component.html',
    styleUrls: ['./dialog-create-categories.component.sass']
})
export class DialogCreateCategoriesComponent implements OnInit {

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly dialogRef: MatDialogRef<DialogCreateCategoriesComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: [null, Validators.required]
    })
    private onSave$: Subject<string> = new Subject();

    ngOnInit(): void {
    }

    handleSaveCategory(): Observable<string> {
        return this.onSave$.asObservable();
    }

    onSubmit() {
        if (this.formGroup.valid) {
            this.onSave$.next(this.formGroup.value);
            this.dialogRef.close();
        }
    }

}
