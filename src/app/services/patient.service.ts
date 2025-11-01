import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private API_KEY = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  private ADD_PATIENT_URL =
    'https://dev-api.evitalrx.in/v1/fulfillment/patients/add';
  private VIEW_PATIENT_URL =
    'https://dev-api.evitalrx.in/v1/fulfillment/patients/view';

  constructor(private http: HttpClient) {}

  createPatient(patientData: any): Observable<any> {
    const body = {
      apikey: this.API_KEY,
      ...patientData,
    };
    return this.http.post(this.ADD_PATIENT_URL, body);
  }

  viewPatientDetail(mobile: string): Observable<any> {
    const body = {
      apikey: this.API_KEY,
      mobile: mobile,
    };
    console.log('Request Body:', body);
    return this.http.post(this.VIEW_PATIENT_URL, body);
  }
}
