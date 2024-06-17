import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private users$: BehaviorSubject<UserModel[]>|null = null;

  getDisabledUsers(): Observable<UserModel[]> {
    return this.httpService.get('users/disabled');
  }

  handleUsers(): Observable<UserModel[]> {
    if (this.users$ === null) {
      this.users$ = new BehaviorSubject<UserModel[]>([]);
      this.loadUsers();
    }
    return this.users$.asObservable();
  }

  getUsersByPage(pageIndex: number, pageSize: number): Observable<UserModel[]> {
    return this.httpService.get(`users/byPage/${pageIndex}/${pageSize}`);
  }

  getUsersByKey(key: string): Observable<UserModel[]> {
    return this.httpService.get(`users/byKey/${key}`);
  }

  loadUsers() {
    this.httpService.get('users').subscribe(users => {
      if (this.users$) {
        this.users$.next(users);
      }
    });
  }

  getCountUsers(): Observable<number> {
    return this.httpService.get(`users/countUsers`);
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.httpService.get(`users/${userId}`);
  }

  create(user: UserModel): Observable<UserModel> {
    return this.httpService.post('users', { user });
  }

  update(user: UserModel, userId: string): Observable<void> {
    return this.httpService.put(`users/${userId}`, { user });
  }

  delete(userId: string): Observable<void> {
    return this.httpService.delete(`users/${userId}`);
  }

  restore(userId: string): Observable<void> {
    return this.httpService.delete(`users/restore/${userId}`);
  }

}
