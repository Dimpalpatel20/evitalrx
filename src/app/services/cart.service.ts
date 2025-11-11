import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  checkoutResponse: any;
patientDetails:any;
availableOrderItems:any;
locationToken:any;
  constructor() { }
   private selectedMedicines: any[] = [];

  setMedicines(meds: any[]) {
    this.selectedMedicines = meds;
  }

  getMedicines() {
    return this.selectedMedicines;
  }
setLocationToken(token:any){
  this.locationToken = token;
}
getLocationToken(){
  return this.locationToken;
}
//   setCheckoutRes(response:any){
// this.checkoutResponse=response;
//   }
//   getCheckoutRes(){
//     return this.checkoutResponse;
//   }
 setCheckoutRes(response: any) {
    // This is the critical step: saving the data before navigation
    this.checkoutResponse = response;
    console.log("CartService: checkoutResponse set to", this.checkoutResponse);
  }

  getCheckoutRes() {
    return this.checkoutResponse;
  }

  setPatientData(data:any){
this.patientDetails = data;
    console.log("CartService: patientDetails set to", this.patientDetails);

  }
  getPatientData(){
    return this.patientDetails
  }
  setOrderPayloadItems(items:any){
    this.availableOrderItems = items;
  }
  getOrderPayloadItems(){
    return this.availableOrderItems;

  }
}
