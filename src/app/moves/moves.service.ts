import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { MoveItemModel } from './move-item.model';
import { CreateMoveItemModel } from './create-move-item.model';
import { ProductModel } from '../products/product.model';
import { CreateMoveModel } from './create-move.model';
import { MoveModel } from './move.model';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovesService {

  constructor(
    private httpService: HttpService,
  ) { }

  private move: MoveModel|null = null;
  private moveItems: CreateMoveItemModel[] = [];
  private moveItems$ = new  BehaviorSubject<CreateMoveItemModel[]>([]);

  handleMoveItems(): Observable<CreateMoveItemModel[]> {
    return this.moveItems$.asObservable();
  }

  getMoveItem(index: number): CreateMoveItemModel {
    return this.moveItems[index];
  }

  updateMoveItem(index: number, moveItem: CreateMoveItemModel) {
    this.moveItems.splice(index, 1, moveItem);
    this.moveItems$.next(this.moveItems);
  }

  removePurchaseItem(index: number) {
    this.moveItems.splice(index, 1);
    this.moveItems$.next(this.moveItems);
  }

  getMoveById(moveId: string): Observable<MoveModel> {
    return this.httpService.get(`moves/byId/${moveId}`);
  }

  setMoveItems(moveItems: CreateMoveItemModel[]) {
    this.moveItems = moveItems;
    this.moveItems$.next(this.moveItems);
  }

  setMove(move: MoveModel) {
    this.move = move;
  }

  getMove() {
    return this.move;
  }

  addMoveItem(product: ProductModel) {
    const index = this.moveItems.findIndex(e => e.productId === product._id);
    if (index < 0) {
      const moveItem: CreateMoveItemModel = {
        fullName: product.fullName,
        productId: product._id,
        quantity: 1,
      };
      this.moveItems.push(moveItem);
    } else {
      const moveItem: CreateMoveItemModel = this.moveItems[index];
      moveItem.quantity += 1;
      this.moveItems.splice(index, 1, moveItem);
    }
    this.moveItems$.next(this.moveItems);
  }

  getCountQuantityMovesInByProduct(
    productId: string,
  ): Observable<number> {
    return this.httpService.get(`moves/countQuantityMoveInItemsByProduct/${productId}`);
  }

  getCountQuantityMovesOutByProduct(
    productId: string,
  ): Observable<number> {
    return this.httpService.get(`moves/countQuantityMoveOutItemsByProduct/${productId}`);
  }

  getCountMoves(params: Params): Observable<number> {
    return this.httpService.get('moves/countMoves', params);
  }

  getMovesByPage(
    pageIndex: number, 
    pageSize: number,
    params: Params,
  ): Observable<MoveItemModel[]> {
    return this.httpService.get(`moves/byPage/${pageIndex}/${pageSize}`, params);
  }

  getMoveInItemsByPageProduct(
    pageIndex: number, 
    pageSize: number,
    productId: string,
    params: Params,
  ): Observable<MoveItemModel[]> {
    return this.httpService.get(`moves/moveInItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params);
  }

  getMoveOutItemsByPageProduct(
    pageIndex: number, 
    pageSize: number,
    productId: string,
    params: Params,
  ): Observable<MoveItemModel[]> {
    return this.httpService.get(`moves/moveOutItemsByPageProduct/${pageIndex}/${pageSize}/${productId}`, params);
  }

  create(
    move: CreateMoveModel, 
    moveItems: CreateMoveItemModel[],
  ) {
    return this.httpService.post('moves', { move, moveItems });
  }

  update(
    move: CreateMoveModel, 
    moveItems: CreateMoveItemModel[],
    moveId: string
  ) {
    return this.httpService.put(`moves/${moveId}`, { move, moveItems });
  }

  delete(moveId: string): Observable<void> {
    return this.httpService.delete(`moves/${moveId}`);
  }

}
