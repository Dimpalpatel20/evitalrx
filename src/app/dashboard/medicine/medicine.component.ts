import { Component } from '@angular/core';
import { MedicinesService } from '../../services/medicines.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CheckoutService } from '../../services/checkout.service';
import { CheckserviceabilityService } from '../../services/checkserviceability.service';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption } from '@angular/material/select';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatRadioButton } from '@angular/material/radio';
import { CartService } from '../../services/cart.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinner,
    MatFormFieldModule,
    
],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css',
})
export class MedicineComponent {
  searchMedicines!:FormGroup
  loading: boolean = false;

  errorMsg = '';
  searchTerm = '';

  medicines: any[] = [];
  selectedMedicines: any[] = [];
  displayedColumns: string[] = [
    'select',
    // 'image',
    'medicine_name',
    'pack_size',
    'medicine_name_suggest',
    'mrp',
  ];
  selectedMedicineIds: any[] = [];

  serviceTypes: any[] = ['regular', 'same_day', 'quick', 'pan_india'];
  selectedServiceTypes: string[] = [];
  hasSearched: boolean = false;

  constructor(
    private medicineS: MedicinesService,
    private _router: Router,
    private route: ActivatedRoute,
    private cartS:CartService,
     private fb: FormBuilder,
  ) {}
  dataSource = this.medicines;
  ngOnInit() {
    // this.searchMedicines = this.fb.group({
    //       searchstring: ['', [Validators.required]],
    //     });
  }
  onSearch() {
    this.loading = true;
    this.hasSearched = true;
    this.medicineS.searchMedicines(this.searchTerm).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.medicines = res?.data?.result || [];
        console.log('this.medicines  :', this.medicines);
      },
      error: (err) => {
        this.loading = false;
        console.error('API Error:', err);
      },
    });
  }
  isSelected(med: any): boolean {
    return this.selectedMedicines.includes(med);
  }
  toggleSelection(med: any) {
    const index = this.selectedMedicines.indexOf(med);
    if (index >= 0) {
      // Deselect
      this.selectedMedicines.splice(index, 1);
      this.selectedMedicineIds = this.selectedMedicineIds.filter(
        (id) => id !== med.medicine_id
      );
    } else {
      // Select
      this.selectedMedicines.push(med);
      this.selectedMedicineIds.push(med.medicine_id);
    }
    console.log('selectedMedicineIds:', this.selectedMedicineIds);
  }

  isAllSelected(): boolean {
    return (
      this.selectedMedicines.length === this.medicines.length &&
      this.medicines.length > 0
    );
  }
  toggleAllSelection(event: any) {
    if (event.checked) {
      this.selectedMedicines = [...this.medicines];
    } else {
      this.selectedMedicines = [];
    }
  }
  addToCart(){
    console.log('Adding to cart:',this.selectedMedicines);
      this.cartS.setMedicines(this.selectedMedicines);
this._router.navigate(['/dashboard/manage-patient'])
  
  }
  // onServiceTypeChange(event: any, service: string) {
  //   if (event.checked) {
  //     this.selectedServiceTypes.push(service);
  //   } else {
  //     this.selectedServiceTypes = this.selectedServiceTypes.filter(
  //       (s) => s !== service
  //     );
  //   }
  // }
  // checkServiceability() {
  //   const serviceabilityPayload: any = {
  //     zipcode: this.patientZipcode,
  //     service_type: JSON.stringify(this.selectedServiceTypes), 
  //     latitude: "12.970612", // 23.1025849,  //12.970612
  //     longitude: "77.6382433", //   72.5953601,   //77.6382433.
      
  //   };
  //   // service_type: this.selectedServiceTypes,
  //   console.log('Serviceability Payload:', serviceabilityPayload);
  //   this.check_serviceabilityS
  //     .checkServiceability(serviceabilityPayload)
  //     .subscribe({
  //       next: (res: any) => {
  //         if (res?.status_code === '0') {
  //           alert(res.status_message || 'Something went wrong.');
  //           return;
  //         }
  //         this.checkserviceabilityResponse = res.data;
  //         this.locationToken = res.data?.location_token || null;
  //         console.log('this.locationToken :', this.locationToken);

  //         console.log(
  //           'this.checkserviceabilityResponse:',
  //           this.checkserviceabilityResponse
  //         );
  //       },
  //       error: (err) => {
  //         this.errorMsg = 'Failed to fetch checkout details';
  //         console.error(err);
  //       },
  //     });
  // }

  // moveToCheckout() {
  //   this.errorMsg = '';
  //   this.checkoutResponse = null;
  //   console.log('Patient ID:', this.patientId);
  //   console.log('selectedMedicineIds :', this.selectedMedicineIds);

  //   if (!this.selectedMedicines.length) {
  //     this.errorMsg = 'Please add medicines to cart first.';
  //     return;
  //   }

  //   const items = this.selectedMedicines.map((med: any) => ({
  //     medicine_id: med.medicine_id,
  //     quantity: med.quantity || 1,
  //   }));
  //   const payload = {
  //     patient_id: this.patientId,
  //     items: JSON.stringify(items),
  //     latitude: 23.1025849, // 22.7196
  //     longitude: 72.5953601, //75.8577
  //     zipcode: '452001',
  //     find_alternative: true,
  //     show_cart_options: true,
  //     location_token: this.locationToken,
  //     delivery_type: this.deliveryType,
  //   };
  //   console.log('payload :', payload);

  //   this.checkoutS.checkout(payload).subscribe({
  //     next: (res: any) => {
  //       this.loading = false;
  //       if (res?.status_code === '0') {
  //         alert(res.status_message || 'Something went wrong.');

  //         const stateData = {
  //           selectedMedicineIds: items,
  //           checkoutData: res,
  //           deliverytype: this.deliveryType,
  //         };
  //         sessionStorage.setItem('checkoutState', JSON.stringify(stateData));
  //         this._router.navigate(['/dashboard/checkout'], {
  //           state: stateData,
  //         });
  //         return;
  //       }
  //       if (!res?.data) {
  //         this.errorMsg = 'No checkout data received.';
  //         return;
  //       }
  //       this.checkoutResponse = res.data;
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.errorMsg = 'Failed to fetch checkout details';
  //       console.error(err);
  //     },
  //   });
  // }
}
// this.medicines=[{
//               "accept_online_order": "yes",
//               "discontinued": "no",
//               "discount_percentage": 0,
//               "gst_percentage": 12,
//               "medicine_id": "X1P9/F3XVunOtftRNNCyHA==",
//               "mrp": 30.74,
//               "quantity": 0,
//               "sell_in_loose": "yes",
//               "available_for_patient": "yes",
//               "content": "Paracetamol (650mg)",
//               "dosage_type": "tablet",
//               "gtin_number": "",
//               "hsn_code": "30049061",
//               "is_rx_required": 0,
//               "popularity_score": 72.72727272727273,
//               "medicine_category": "drug",
//               "primary_category_id": 819,
//               "manufacturer_name": "Micro Labs Ltd",
//               "medicine_name": "Dolo 650 Tablet",
//               "medicine_name_suggest": "Dolo 650 Tablet",
//               "medicine_type": "drug",
//               "pack_size": "15 Tablet",
//               "packing_size": "1 Strip of  15 Tablet",
//               "price": 30.74,
//               "salt_content_id": "+qIGHQHPc9AJh9QUPHyMSA==",
//               "schedule_type": "H",
//               "size": 15,
//               "slug": "dolo-650-tablet-M00234T",
//               "price_per_unit": 2.05,
//               "unit": "Tablet"
//           },
//           {
//               "accept_online_order": "yes",
//               "discontinued": "no",
//               "discount_percentage": 0,
//               "gst_percentage": 12,
//               "medicine_id": "HD3nI9bnanVvGm6N6jthJw==",
//               "mrp": 50,
//               "quantity": 0,
//               "sell_in_loose": "yes",
//               "available_for_patient": "no",
//               "content": "Losartan Potassium (100mg)",
//               "dosage_type": "tablet",
//               "gtin_number": "",
//               "hsn_code": "0",
//               "is_rx_required": 0,
//               "popularity_score": 46.96969696969697,
//               "medicine_category": "",
//               "primary_category_id": 0,
//               "manufacturer_name": "Alkem Laboratories Ltd",
//               "medicine_name": "Dolo 650 Tablet (15 Tablet)",
//               "medicine_name_suggest": "Dolo 650 Tablet (15 Tablet)",
//               "medicine_type": "",
//               "pack_size": "15 Tablet",
//               "packing_size": "1 Strip of  15 Tablet",
//               "price": 50,
//               "salt_content_id": "klejjWIyfAodC8J11IGD7w==",
//               "schedule_type": "",
//               "size": 15,
//               "slug": "dolo-650-tablet-15-tablet-MDOTC316961964353",
//               "thumb_image": "https://d3cgpvqmlaynvp.cloudfront.net/storage/medicines/thumb/default.jpg",
//               "price_per_unit": 3.33,
//               "unit": "Tablet"
//           },]
