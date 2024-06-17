import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { MovesService } from '../moves.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { DialogDetailMovesComponent } from '../dialog-detail-moves/dialog-detail-moves.component';
import { OfficeModel } from '../../auth/office.model';
import { AuthService } from '../../auth/auth.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { OfficesService } from '../../offices/offices.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MoveModel } from '../move.model';
import { formatDate } from '@angular/common';
import { buildExcel } from '../../buildExcel';

@Component({
    selector: 'app-moves',
    templateUrl: './moves.component.html',
    styleUrls: ['./moves.component.sass']
})
export class MovesComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly officesService: OfficesService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly movesService: MovesService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        officeId: '',
    });
    displayedColumns: string[] = ['created', 'user', 'office', 'toOffice', 'observations', 'actions'];
    dataSource: any[] = [];
    length: number = 0;
    pageSize: number = 10;
    pageSizeOptions: number[] = [10, 30, 50];
    pageIndex: number = 0;
    office: OfficeModel = new OfficeModel();
    offices: OfficeModel[] = [];
    private params: Params = {};

    private handleOffices$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleOffices$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Traspasos')
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.office = auth.office
            this.formGroup.patchValue({ officeId: this.office._id })
            Object.assign(this.params, { officeId: this.office._id })
            this.fetchData()
            this.fetchCount()
        })

        this.handleOffices$ = this.officesService.handleOfficesByActivity().subscribe(offices => {
            this.offices = offices
        })

        this.navigationService.setMenu([
            // { id: 'search', label: 'Buscar', icon: 'search', show: true },
            { id: 'excel_simple', label: 'Excel Simple', icon: 'file_download', show: false },
        ]);

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            if (id === 'excel_simple') {
                this.navigationService.loadBarStart();
                const chunk = 500;
                const promises: Promise<any>[] = [];
                for (let index = 0; index < this.length / chunk; index++) {
                    const promise = lastValueFrom(this.movesService.getMovesByPage(index + 1, chunk, this.params))
                    promises.push(promise);
                }

                Promise.all(promises).then(values => {
                    this.navigationService.loadBarFinish();
                    const moves = values.flat() as MoveModel[];
                    const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
                    let body = [];
                    body.push([
                        'F. REGISTRO',
                        'USUARIO',
                        'ORIGEN',
                        'DESTINO',
                        'OBSERVACIONES',
                    ]);
                    for (const move of moves) {
                        body.push([
                            formatDate(move.createdAt, 'dd/MM/yyyy', 'en-US'),
                            move.user.name,
                            move.office.name,
                            move.toOffice.name,
                            move.observations
                        ]);
                    }
                    const name = `TRASPASOS`;
                    buildExcel(body, name, wscols, []);
                });
            }
        })
    }

    fetchCount() {
        this.movesService.getCountMoves(this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart();
        this.movesService.getMovesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(movesIn => {
            this.navigationService.loadBarFinish();
            this.dataSource = movesIn;
        }, (error: HttpErrorResponse) => {
            this.navigationService.loadBarFinish();
            this.navigationService.showMessage(error.error.message);
        });
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize };

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

        this.fetchData();
    }

    onDialogDetailMoves(moveId: string) {
        this.matDialog.open(DialogDetailMovesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: moveId
        });
    }

    onDelete(moveId: string) {
        const ok = confirm('Esta seguro de eliminar?...');
        if (ok) {
            this.navigationService.loadBarStart();
            this.movesService.delete(moveId).subscribe(() => {
                this.navigationService.loadBarFinish();
                this.fetchData();
            });
        }
    }

    onOfficeChange() {

        this.pageIndex = 0

        const { officeId } = this.formGroup.value

        const queryParams: Params = { officeId, pageIndex: this.pageIndex, key: null }

        Object.assign(this.params, { officeId })

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

}
