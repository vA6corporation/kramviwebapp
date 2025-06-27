import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../http.service';
import { TurnModel } from './turn.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TurnsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private turn: TurnModel | null = null
    private turn$ = new Subject<TurnModel | null>()

    getTurnById(turnId: string): Observable<TurnModel> {
        return this.httpService.get(`turns/byId/${turnId}`)
    }

    setTurn(turn: TurnModel): void {
        if (this.turn$) {
            this.turn$.next(turn)
        }
    }

    handleOpenTurn(isOfficeTurn: boolean): Observable<TurnModel | null> {
        if (isOfficeTurn) {
            if (this.turn === null) {
                this.loadOfficeTurn()
            } else {
                setTimeout(() => {
                    this.turn$.next(this.turn)
                })
            }
        } else {
            if (this.turn === null) {
                this.loadTurn()
            } else {
                setTimeout(() => {
                    this.turn$.next(this.turn)
                })
            }
        }
        return this.turn$.asObservable()
    }

    getCountTurns(params: Params): Observable<number> {
        return this.httpService.get(`turns/countTurns`, params)
    }

    getTurnsByPage(
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<TurnModel[]> {
        return this.httpService.get(`turns/byPage/${pageIndex}/${pageSize}`, params)
    }

    update(turnId: string, turn: any): Observable<void> {
        return this.httpService.put(`turns/${turnId}`, { turn })
    }

    updateObservations(turnId: string, observations: string): Observable<void> {
        return this.httpService.put(`turns/observations/${turnId}`, { observations })
    }

    updateCreatedAt(turnId: string, createdAt: string): Observable<void> {
        return this.httpService.put(`turns/createdAt/${turnId}`, { createdAt })
    }

    updateOpenTurn(turnId: string): Observable<void> {
        return this.httpService.put(`turns/openTurn/${turnId}`, {})
    }

    changeTurn(saleId: string, turnId: string) {
        return this.httpService.get(`turns/changeTurn/${saleId}/${turnId}`)
    }

    loadTurn() {
        this.httpService.get('turns/openTurn').subscribe({
            next: turn => {
                this.turn = turn
                this.turn$.next(turn)
            }, error: (error: HttpErrorResponse) => {
                console.log(error)
                this.turn$.next(null)
            }
        })
    }

    loadOfficeTurn() {
        this.httpService.get('turns/openOfficeTurn').subscribe({
            next: turn => {
                this.turn = turn
                this.turn$.next(turn)
            }, error: (error: HttpErrorResponse) => {
                console.log(error)
                this.turn$.next(null)
            }
        })
    }

    createOfficeTurn(openCash: number): void {
        this.httpService.post('turns/openOfficeTurn', { openCash }).subscribe(turn => {
            this.turn$.next(turn)
        })
    }

    createTurn(openCash: number): void {
        this.httpService.post('turns/openTurn', { openCash }).subscribe(turn => {
            this.turn$.next(turn)
        })
    }

    closeTurn(turnId: string) {
        this.turn$.next(null)
        this.turn = null
        return this.httpService.get(`turns/closeTurn/${turnId}`)
    }

    delete(turnId: string): Observable<void> {
        return this.httpService.delete(`turns/${turnId}`)
    }
}
