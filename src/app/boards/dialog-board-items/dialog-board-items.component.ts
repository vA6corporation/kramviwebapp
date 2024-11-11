import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SettingModel } from '../../auth/setting.model';
import { BoardItemModel } from '../board-item.model';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-dialog-board-items',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule],
    templateUrl: './dialog-board-items.component.html',
    styleUrls: ['./dialog-board-items.component.sass']
})
export class DialogBoardItemsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        readonly boardItem: BoardItemModel,
        private readonly formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly dialogRef: MatDialogRef<DialogBoardItemsComponent>,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        quantity: [this.boardItem.quantity, Validators.required],
        price: [this.boardItem.price, Validators.required],
        observations: this.boardItem.observations,
        isBonus: this.boardItem.igvCode === '11',
    })
    setting: SettingModel = new SettingModel()

    private onDeleteBoardItem$: EventEmitter<void> = new EventEmitter()
    private onUpdateBoardItem$: EventEmitter<any> = new EventEmitter()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.setting = auth.setting
        })
    }

    subTotal(): number {
        const { quantity } = this.formGroup.value
        return Number((this.boardItem.price * quantity).toFixed(2))
    }

    onChangeSubTotal(value: string) {
        const subTotal = Number(value) / this.boardItem.price
        this.formGroup.get('quantity')?.patchValue(subTotal.toFixed(4))
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.onUpdateBoardItem$.next(this.formGroup.value)
            this.dialogRef.close()
        }
    }

    handleUpdateBoardItem(): Observable<any> {
        return this.onUpdateBoardItem$.asObservable()
    }

    handleDeleteBoardItem(): Observable<void> {
        return this.onDeleteBoardItem$.asObservable()
    }

    onDeleteBoardItem(): void {
        this.onDeleteBoardItem$.emit()
    }

}
