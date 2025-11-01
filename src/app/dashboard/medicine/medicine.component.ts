import { Component } from '@angular/core';
import { MedicinesService } from '../../services/medicines.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CheckoutService } from '../../services/checkout.service';
import { CheckserviceabilityService } from '../../services/checkserviceability.service';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatOption } from "@angular/material/select";
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatRadioButton } from "@angular/material/radio";

@Component({
  selector: 'app-medicine',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatCard,
    MatRadioButton
],
  // MatProgressSpinner
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.css',
})
export class MedicineComponent {
  loading :boolean = false;
  patient: any;
  patientZipcode: any;
  checkoutResponse: any;
  checkserviceabilityResponse={
    "status_code": "1",
    "status_message": "Success",
    "datetime": "2025-05-14 10:22:04",
    "version": "1.1.133",
    "data": {
        "quick": null,
        "regular": {
            "serviceable": true,
            "error_slug": "",
            "location_token": "0P6Hm1/BNc7uxzkOSZaBLVm6SiC2t0JAqdfTAkYsDVYnjO35Tp80VHQ/aZ9mWsGRs0y47uR97JYB5QvSDMltGUXuEppfksSED8isKapydaYzu+gfqX/0pH9syqVpDt2KL1tjCG+YhTdGeHuHDTKfOvFXtcAzEMOHWEOr8sSvnT4="
        },
        "same_day": {
            "serviceable": true,
            "error_slug": "",
            "location_token": "0P6Hm1/BNc7uxzkOSZaBLeGCJnWMLSOhvviSlR4mPlwrfwFot7T7TaVdW3JvgTd9C6SfulvWvA9nNXXXp2J3cNEKLbLvMJwhxzTgAWUP8wrGBBL2ONKI3DD/wx9lNM2R+5utflMGYgl6kuZ3zfZlEQz4Bz9yNzOTirPgVMYw/7A="
        },
        "pan_india": null
    }
};
  errorMsg = '';
  patientId: any;
  searchTerm = '';
  deliveryType: string = 'delivery'; 
 locationToken: any = 
  this.checkserviceabilityResponse?.data?.regular?.location_token ||
  this.checkserviceabilityResponse?.data?.same_day?.location_token ||
  null;
  medicines: any[] = [];
  selectedMedicines: any[] = [];
  displayedColumns: string[] = [
    'select',
    'medicine_name',
    'pack_size',
    'mrp',
    'medicine_name_suggest',
  ];
  selectedMedicineIds: any[] = [];
  // 4 delivery-service
  // quick : delivery within 30 mins.
  // regular : delivery within 2 hour.
  // same_day : delivery within 24 hour.
  // pan_india : delivery within 5-7 days varies upon distance

  serviceTypes: any[] = ['regular', 'same_day', 'quick', 'pan_india'];
  selectedServiceTypes: string[] = [];

  constructor(
    private medicineS: MedicinesService,
    private _router: Router,
    private route: ActivatedRoute,
    private checkoutS: CheckoutService,
    private check_serviceabilityS: CheckserviceabilityService
  ) {}
  dataSource = this.medicines;
  ngOnInit() {
    const patientData = localStorage.getItem('selectedPatient');
    console.log('patientData :', patientData);
    if (patientData !== null) {
      this.patient = JSON.parse(patientData);
      this.patientId = this.patient.patient_id;
      this.patientZipcode = this.patient.zipcode;
    }
    console.log('patient_id ::', this.patient.patient_id);

console.log("checkserviceabilityResponse ::",this.checkserviceabilityResponse);

// this.locationToken =
  // this.checkserviceabilityResponse?.regular?.location_token ||
  //  this.checkserviceabilityResponse?.same_day?.location_token ||
  //  this.checkserviceabilityResponse?.quick?.location_token ||
  //  this.checkserviceabilityResponse?.pan_india?.location_token ||
  // null;
  console.log("this.locationToken  :::::",this.locationToken );

  }

  onSearch() {
      this.loading = true; 
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

  console.log("selectedMedicineIds:", this.selectedMedicineIds);
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
  onServiceTypeChange(event: any, service: string) {
    if (event.checked) {
      this.selectedServiceTypes.push(service);
    } else {
      this.selectedServiceTypes = this.selectedServiceTypes.filter(
        (s) => s !== service
      );
    }
  }
  checkServiceability() {
    const serviceabilityPayload: any = {
      zipcode: this.patientZipcode,
      service_type: this.selectedServiceTypes,
      latitude: 12.970612, // 23.1025849,  //12.970612
      longitude: 77.6382433, //   72.5953601,   //77.6382433
    };
    console.log('Serviceability Payload:', serviceabilityPayload);
    this.check_serviceabilityS
      .checkServiceability(serviceabilityPayload)
      .subscribe({
        next: (res: any) => {
           if (res?.status_code === "0") {
        alert(res.status_message || 'Something went wrong.');
        return;
      }
          this.checkserviceabilityResponse = res.data;
this.locationToken = res.data?.location_token || null;
console.log("this.locationToken :",this.locationToken);

          console.log(
            'this.checkserviceabilityResponse:',
            this.checkserviceabilityResponse
          );
        },
        error: (err) => {
          this.errorMsg = 'Failed to fetch checkout details';
          console.error(err);
        },
      });
  }

  moveToCheckout() {
    this.errorMsg = '';
    this.checkoutResponse = null;
    console.log('Patient ID:', this.patientId);
    console.log("selectedMedicineIds :",this.selectedMedicineIds);
    
 
  if (!this.selectedMedicines.length) {
    this.errorMsg = 'Please add medicines to cart first.';
    return;
  }

  const items = this.selectedMedicines.map((med: any) => ({
    medicine_id: med.medicine_id,
    quantity: med.quantity || 1 
  }));
    const payload = {
      patient_id: this.patientId,
      items: JSON.stringify(items),
      latitude: 23.1025849, // 22.7196
      longitude: 72.5953601, //75.8577
      zipcode: '452001',
      find_alternative: true,
      show_cart_options: true,
      location_token:this.locationToken,
      delivery_type:this.deliveryType,
    };
console.log("payload :",payload);

    this.checkoutS.checkout(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.status_code === "0") {
        alert(res.status_message || 'Something went wrong.');
        
        const stateData = {
          selectedMedicineIds: items,
          checkoutData: res,
          deliverytype: this.deliveryType,
        };

        // ✅ store in sessionStorage for persistence
        sessionStorage.setItem('checkoutState', JSON.stringify(stateData));
        this._router.navigate(['/dashboard/checkout'],{
                     state: stateData,

           });
        return;
      }
          if (!res?.data) {
    this.errorMsg = 'No checkout data received.';
    return;
  }
          this.checkoutResponse = res.data;
          //  this._router.navigate(['/dashboard/checkout'],{
          //   state:{
          //      selectedMedicineIds: items,
          //   checkoutData: this.checkoutResponse,
          //   deliverytype:this.deliveryType
          //   }
          //  });
    
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Failed to fetch checkout details';
        console.error(err);
      },
    });
  }
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
