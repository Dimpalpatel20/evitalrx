import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlaceOrderService } from '../../services/place-order.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placeorder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './placeorder.component.html',
  styleUrl: './placeorder.component.css',
})
export class PlaceorderComponent {
  patient: any;
  patientZipcode: any;
  patientId: any;
  MedicineIds: any;
  deliverytype: any = 'pickup ';
  location_token =
    '0P5Hm1/BNc7uxzkOSZaBLVm6SiC2t0JAqdfTAkYsDVYnjO35Tp80VHQ/aZ9mWsGRs0y47uR97JYB5QvSDMltGUXuEppfksSED8isKapydaYzu+gfqX/0pH9syqVpDt2KL1tjCG+YhTdGeHuHDTKfOvFXtcAzEMOHWEOr8sSvnT4=';

  placeOrderForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private placeOrderS: PlaceOrderService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    const navigation = this._router.getCurrentNavigation();
    let state = navigation?.extras?.state;
    console.log('state:', state);

    if (!state) {
      const savedState = sessionStorage.getItem('placeOrderState');
      console.log('savedState :', savedState);
      if (!state) {
        const savedState = sessionStorage.getItem('placeOrderState');
        if (savedState) {
          state = JSON.parse(savedState);
          console.log('state :', state);
        }
      }
      if (state) {
        this.MedicineIds = state['selectedMedicineIds'];
        this.deliverytype = state['delivery_type'];
        console.log('MedicineIds:', this.MedicineIds);
        console.log('deliverytype:', this.deliverytype);
      } else {
        console.warn('⚠️ No state found in navigation or sessionStorage!');
      }
      const patientData = localStorage.getItem('selectedPatient');
      console.log('patientData :', patientData);
      console.log('MedicineIds :', this.MedicineIds);

      if (patientData !== null) {
        this.patient = JSON.parse(patientData);
        this.patientId = this.patient.patient_id;
        this.patientZipcode = this.patient.zipcode;
      }
      console.log('patient_id ::', this.patient.patient_id);
      this.placeOrderForm = this.fb.group({
        address: [''],
        address_line2: [''],
        city: [''],
        state: [''],
      });

      // 🔹 Apply initial validation if deliveryType is 'delivery'
      if (this.deliverytype === 'delivery') {
        this.setDeliveryValidators(true);
      } else {
        this.setDeliveryValidators(false);
      }
    }
  }
  private setDeliveryValidators(isDelivery: boolean): void {
    const address = this.placeOrderForm.get('address');
    const city = this.placeOrderForm.get('city');
    const state = this.placeOrderForm.get('state');

    if (isDelivery) {
      address?.setValidators([Validators.required]);
      city?.setValidators([Validators.required]);
      state?.setValidators([Validators.required]);
    } else {
      address?.clearValidators();
      city?.clearValidators();
      state?.clearValidators();
    }

    address?.updateValueAndValidity();
    city?.updateValueAndValidity();
    state?.updateValueAndValidity();
  }
  submitOrder(form: FormGroup) {
    console.log('form.value :', form.value);
    // if (form.invalid) {
    //   this.placeOrderForm.markAllAsTouched();
    //   return;
    // }
    const payload = form.value;
    console.log('Final Payload:', payload);
    if (form.valid) {
      const fullAddress = form.value.address
        ? `${form.value.address}, ${form.value.address_line2 || ''}, ${
            form.value.city || ''
          }, ${form.value.state || ''}, ${this.patientZipcode}`
        : this.patientZipcode; // if address not provided, send only zipcode

      const payload = {
        patient_id: this.patientId,
        zipcode: this.patientZipcode,
        location_token: this.location_token,
        delivery_type: this.deliverytype,
        address: form.value.address,
        address_line2: form.value.address_line2,
        city: form.value.city,
        state: form.value.state,
        items: JSON.stringify(this.MedicineIds),
        full_address: fullAddress.trim(),
      };
      console.log('Final Payload:', payload);
      this.placeOrderS.createPatient(payload).subscribe({
        next: (response) => {
          if (response?.status_code === '0') {
            alert(response.status_message || 'Something went wrong.');
          }
          console.log('Order Response:', response);
          alert('Order placed successfully!');
        },
        error: (error) => {
          console.error('Error placing order:', error);
          alert('Failed to place order. Please try again.');
        },
      });
    }
  }
}
