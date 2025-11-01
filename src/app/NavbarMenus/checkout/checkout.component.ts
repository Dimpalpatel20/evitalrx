import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
    standalone:true,
  imports: [CommonModule, MatTableModule, MatCard, MatExpansionModule, MatCardTitle, MatCardContent,MatButtonModule,],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
 pharmacy: any;
  items: any[] = [];

  displayedColumns: string[] = [
    'medicine_name',
    'content',
    'gst_percentage',
    'mrp',
    'available_for_patient',
    'available',
    'discount_percentage',
    'price'
    
  ];
  selectedMedicineIds: any;
  checkoutData: any;
  delivery_type: any;
 constructor(
    private _router: Router,
  ) {}
  ngOnInit() {
     const navigation = this._router.getCurrentNavigation();
  let state = navigation?.extras?.state;

  console.log('ngOnInit called!');
  console.log('state from navigation:', state);

  if (!state) {
    const savedState = sessionStorage.getItem('checkoutState');
    if (savedState) {
      state = JSON.parse(savedState);
      console.log('state restored from sessionStorage:', state);
    }
  }

  if (state) {
    this.selectedMedicineIds = state['selectedMedicineIds'];
    this.checkoutData = state['checkoutData'];
    this.delivery_type = state['deliverytype'];

    console.log('this.selectedMedicineIds from state:', this.selectedMedicineIds);
    console.log('this.checkoutData:', this.checkoutData);
    console.log('this.delivery_type:', this.delivery_type);
  } else {
    console.warn('No state found in sessionStorage!');
  }
   this.checkoutData = {
      "status_code": "1",
      "status_message": "Success",
      "data": {
        "shipping_charges": 30,
        "chemist_details_list": [
          {
            "chemist_details": {
              "pharmacy_name": "Bhargav Pharmacy",
              "full_address": "Evital Rx 4d Square Mall, Ahmedabad, Gujarat, India, 380005",
              "zipcode": "380005"
            }
          }
        ],
        "items": [
          {
            "mrp": 42.83,
            "price": 38.55,
            "discount_percentage": 10,
            "available": "yes",
            "alternatives": [
              {
                "medicine_name": "Lanol ER Tablet (10 Tablet)",
                "gst_percentage": 12,
                "content": "Paracetamol (650mg)",
                "available_for_patient": "yes",
                "available": "yes",
                "discount_percentage": 10,
                "price": 20.16
              }
            ]
          },
          {
            "mrp": 23.5,
            "price": 21.15,
            "discount_percentage": 10,
            "available": "yes",
            "alternatives": []
          }
        ]
      }
    };

    this.pharmacy = this.checkoutData.data.chemist_details_list[0].chemist_details;
    this.items = this.checkoutData.data.items;
  }
  moveToPlaceorder(){
    const stateData = {
    selectedMedicineIds: this.selectedMedicineIds,
    delivery_type: this.delivery_type
  };
    sessionStorage.setItem('placeOrderState', JSON.stringify(stateData));

     this._router.navigate(['/dashboard/place-order'],{
      state:{stateData}
     });
  }
}
