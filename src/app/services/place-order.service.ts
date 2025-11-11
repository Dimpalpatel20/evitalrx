import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaceOrderService {
  private API_KEY = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  private PLACE_ORDER =
    'https://dev-api.evitalrx.in/v1/fulfillment/orders/place_order_v3';

  constructor(private http: HttpClient) {}

  createPatient(orderData: any): Observable<any> {
    const body = {
      apikey: this.API_KEY,
      ...orderData,
    };
    return this.http.post(this.PLACE_ORDER, body);
  }
}
