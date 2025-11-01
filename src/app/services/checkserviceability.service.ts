import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckserviceabilityService {
  private API_KEY = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  private CHECK_SERVICEABILITY =
    'https://dev-api.evitalrx.in/v1/fulfillment/orders/check_serviceability_v3';
  constructor(private http: HttpClient) {}
  checkServiceability(serviceabilityPayload: any): Observable<any> {
    const body = {
      apikey: this.API_KEY,
      ...serviceabilityPayload,
    };
    console.log('Request Body:', body);
    return this.http.post(this.CHECK_SERVICEABILITY, body);
  }
}
