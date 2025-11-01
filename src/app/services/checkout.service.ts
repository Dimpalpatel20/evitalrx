import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private CHECKOUT =
    'https://dev-api.evitalrx.in/v1/fulfillment/orders/checkout_v3';
  private API_KEY = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  // private Location_token = "0P6Hm1/BNc7uxzkOSZaBLVm6SiC2t0JAqdfTAkYsDVYnjO35Tp80VHQ/aZ9mWsGRs0y47uR97JYB5QvSDMltGUXuEppfksSED8isKapydaYzu+gfqX/0pH9syqVpDt2KL1tjCG+YhTdGeHuHDTKfOvFXtcAzEMOHWEOr8sSvnT4="

  constructor(private http: HttpClient) {}

  checkout(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('headers :', headers);
    const body = {
      ...payload,
      apikey: this.API_KEY,
    };
    return this.http.post(this.CHECKOUT, body, { headers });
  }
}
