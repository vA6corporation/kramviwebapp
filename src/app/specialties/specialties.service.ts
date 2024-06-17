import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SpecialtyModel } from '../events/specialty.model';
import { HttpService } from '../http.service';
import { CreateSpecialtyModel } from './create-specialty.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialtiesService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  private specialties$: BehaviorSubject<SpecialtyModel[]>|null = null;

  getSpecialtiesCount(): Observable<number> {
    return this.httpService.get('specialties/countSpecialties');
  }

  getSpecialtyById(specialtyId: string): Observable<SpecialtyModel> {
    return this.httpService.get(`specialties/byId/${specialtyId}`);
  }

  deleteSpecialty(specialtyId: string): Observable<void> {
    return this.httpService.delete(`specialties/${specialtyId}`);
  }

  handleSpecialties() {
    if (this.specialties$ === null) {
      this.specialties$ = new BehaviorSubject<SpecialtyModel[]>([]);
      this.loadSpecialties();
    }
    return this.specialties$.asObservable();
  }

  loadSpecialties() {
    this.httpService.get('specialties').subscribe(specialties => {
      if (this.specialties$) {
        this.specialties$.next(specialties);
      }
    });
  }

  getSpecialtiesByPage(pageIndex: number, pageSize: number) {
    return this.httpService.get(`specialties/byPage/${pageIndex}/${pageSize}`)
  }

  create(specialty: CreateSpecialtyModel) {
    return this.httpService.post('specialties', { specialty });
  }

  update(specialty: CreateSpecialtyModel, specialtyId: string) {
    return this.httpService.put(`specialties/${specialtyId}`, { specialty });
  }
}
