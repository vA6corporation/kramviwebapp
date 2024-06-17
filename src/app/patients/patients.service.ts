import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { PatientModel } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  getById(patientId: string): Observable<PatientModel> {
    return this.httpService.get(`patients/byId/${patientId}`);
  }

  getPatientsByKey(key: string): Observable<PatientModel[]> {
    return this.httpService.get(`patients/byKey/${key}`)
  }

  getPatientsByDocument(documentType: string, document: string): Observable<PatientModel[]> {
    return this.httpService.get(`patients/byDocument/${documentType}/${document}`);
  }

  getPatientsByPage(pageIndex: number, pageSize: number): Observable<PatientModel[]> {
    return this.httpService.get(`patients/byPage/${pageIndex}/${pageSize}`);
  }

  getPatientsCount(): Observable<number> {
    return this.httpService.get(`patients/count`);
  }

  create(patient: PatientModel): Observable<PatientModel> {
    return this.httpService.post('patients', { patient });
  }

  update(patient: PatientModel, patientId: string): Observable<void> {
    return this.httpService.put(`patients/${patientId}`, { patient });
  }
}
