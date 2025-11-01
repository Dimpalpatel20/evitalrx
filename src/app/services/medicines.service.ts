import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicinesService {
  private MIDICINE =
    'https://staging-search.evitalrx.in/v1/fulfillment/medicines/pillo/search';
  private API_KEY = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';

  constructor(private http: HttpClient) {}
  searchMedicines(searchString: string): Observable<any> {
    const body = {
      apikey: this.API_KEY,
      searchstring: searchString,
    };
    console.log('body :', body);

    return this.http.post(this.MIDICINE, body);
  }
}
