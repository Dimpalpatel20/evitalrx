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
import { MatAccordion, MatExpansionPanelTitle, MatExpansionModule }  from "@angular/material/expansion";
import { MatExpansionPanel } from "@angular/material/expansion";
import { CartService } from '../../services/cart.service';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-placeorder',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatAccordion,
    MatExpansionPanelTitle,
    MatExpansionModule,
    MatExpansionModule,
    MatExpansionPanel,
    MatDividerModule,
    MatExpansionPanel,
    MatIconModule
],
  templateUrl: './placeorder.component.html',
  styleUrl: './placeorder.component.css',
})
export class PlaceorderComponent {
  deliveryForm!: FormGroup;
  patient:any;
  patientId:any;
  patientName:string='';
  checkoutData: any;
  locationToken:string='';
  Items:any;
  mobile: any;
 constructor(private fb: FormBuilder,private cartS:CartService,private placeOrderS:PlaceOrderService ){}

  ngOnInit(): void {
            // const patient=  this.cartS.getCheckoutRes();
            // this.


        this.patient = this.cartS.getPatientData();
        console.log(" this.patient :", this.patient);
        // this.patientId = this.patient.patient_id;
        this.patientId = this.patient[0].patient_id;
        console.log("  this.patientId :",  this.patientId);
        this.patientName=this.patient[0].patient_name;
        console.log("patientName :",this.patientName);
        
        this.mobile=this.patient[0].mobile;
        console.log("mobile :",this.mobile);
        
            this.checkoutData = this.cartS.getCheckoutRes();
                        console.log("this.checkoutData :",this.checkoutData);  

            this.locationToken= this.cartS.getLocationToken();
            
            console.log("this.locationToken :",this.locationToken);  
     this.Items=  this.cartS.getOrderPayloadItems();
console.log("Orderable Items Array :",this.Items);
//  if (this.deliveryForm.valid) {
//   const formValue = this.deliveryForm.value;
//   console.log("formValue :",formValue);
  
//  }
    this.deliveryForm = this.fb.group({
      deliveryType: ['', Validators.required], 
      address: ['', null],
      address_line2: ['', null],
      city: ['', null],
      state: ['', null],
      zipcode: ['', null],
      items:['']
    });

    // 1. Subscribe to changes in deliveryType to update address validators
    this.deliveryForm.get('deliveryType')?.valueChanges.subscribe(type => {
      this.updateAddressValidation(type);
    });

    // 2. Initialize validation based on the default value
    this.updateAddressValidation(this.deliveryForm.get('deliveryType')?.value);
  }

  // Helper function to dynamically enable/disable address fields and validators
  private updateAddressValidation(type: string) {
    const addressControls = ['address', 'city', 'state', 'zipcode'];
    const addressLine2Control = this.deliveryForm.get('address_line2');

    if (type === 'delivery') {
      addressControls.forEach(controlName => {
        const control = this.deliveryForm.get(controlName);
        control?.setValidators(Validators.required);
        control?.enable();
      });
      // address_line2 is optional
      addressLine2Control?.enable();
    } else { // 'pickup' or any other type
      addressControls.forEach(controlName => {
        const control = this.deliveryForm.get(controlName);
        control?.clearValidators();
        control?.disable();
      });
      addressLine2Control?.clearValidators();
      addressLine2Control?.disable();
    }

    this.deliveryForm.updateValueAndValidity();
  
  }

  // Function to submit the data for the Checkout V3 API
  onSubmit(form:FormGroup) {

    if (this.deliveryForm.valid) {
      const formValue=form.value;
      const Payload: any = {
        location_token:this.locationToken,
        patient_id:this.patientId,
        items:JSON.stringify(this.Items),
        delivery_type:formValue.deliveryType,
        address:formValue.address,
        address_line2:formValue.address_line2,
        city:formValue.city,
        state:formValue.state,
        zipcode:formValue.zipcode,
      latitude: "23.1025849",     // ,  "12.970612"
      longitude: "72.5953601", //   ,      77.6382433
    };
      
      // Clean up payload: remove null/disabled fields for 'pickup'
      if (Payload.deliveryType === 'pickup') {
        delete Payload.address;
        delete Payload.address_line2;
        delete Payload.city;
        delete Payload.state;
        delete Payload.zipcode;
      }
      console.log("Final Checkout Payload:", Payload);
      // Call your checkout service here...
      this.placeOrderS.createPatient(Payload).subscribe((res:any)=>{
        console.log("res :",res);
        

      })
    } else {
      console.error("Form is invalid. Check required fields.");
      // Mark all fields as touched to show errors
      this.deliveryForm.markAllAsTouched();
    }
  }
  // patient: any;
  // patientZipcode: any;
  // patientId: any;
  // MedicineIds: any;
  // deliverytype: any = 'delivery';
  // location_token =
  //   '0P5Hm1/BNc7uxzkOSZaBLVm6SiC2t0JAqdfTAkYsDVYnjO35Tp80VHQ/aZ9mWsGRs0y47uR97JYB5QvSDMltGUXuEppfksSED8isKapydaYzu+gfqX/0pH9syqVpDt2KL1tjCG+YhTdGeHuHDTKfOvFXtcAzEMOHWEOr8sSvnT4=';

  // placeOrderForm!: FormGroup;
  // constructor(
  //   private fb: FormBuilder,
  //   private placeOrderS: PlaceOrderService,
  //   private _router: Router
  // ) {}
  // ngOnInit(): void {
    // const navigation = this._router.getCurrentNavigation();
    // let state = navigation?.extras?.state;
    // console.log('state:', state);

    // if (!state) {
    //   const savedState = sessionStorage.getItem('placeOrderState');
    //   console.log('savedState :', savedState);
    //   if (!state) {
    //     const savedState = sessionStorage.getItem('placeOrderState');
    //     if (savedState) {
    //       state = JSON.parse(savedState);
    //       console.log('state :', state);
    //     }
    //   }
    //   if (state) {
    //     this.MedicineIds = state['selectedMedicineIds'];
    //     this.deliverytype = state['delivery_type'];
    //     console.log('MedicineIds:', this.MedicineIds);
    //     console.log('deliverytype:', this.deliverytype);
    //   } else {
    //     console.warn('⚠️ No state found in navigation or sessionStorage!');
    //   }
    //   const patientData = localStorage.getItem('selectedPatient');
    //   console.log('patientData :', patientData);
    //   console.log('MedicineIds :', this.MedicineIds);

    //   if (patientData !== null) {
    //     this.patient = JSON.parse(patientData);
    //     this.patientId = this.patient.patient_id;
    //     this.patientZipcode = this.patient.zipcode;
    //   }
    //   console.log('patient_id ::', this.patient.patient_id);
    //   this.placeOrderForm = this.fb.group({
    //     address: [''],
    //     address_line2: [''],
    //     city: [''],
    //     state: [''],
    //   });

    //   // 🔹 Apply initial validation if deliveryType is 'delivery'
    //   if (this.deliverytype === 'delivery') {
    //     this.setDeliveryValidators(true);
    //   } else {
    //     this.setDeliveryValidators(false);
    //   }
    // }
 // }
  // private setDeliveryValidators(isDelivery: boolean): void {
  //   const address = this.placeOrderForm.get('address');
  //   const city = this.placeOrderForm.get('city');
  //   const state = this.placeOrderForm.get('state');

  //   if (isDelivery) {
  //     address?.setValidators([Validators.required]);
  //     city?.setValidators([Validators.required]);
  //     state?.setValidators([Validators.required]);
  //   } else {
  //     address?.clearValidators();
  //     city?.clearValidators();
  //     state?.clearValidators();
  //   }

  //   address?.updateValueAndValidity();
  //   city?.updateValueAndValidity();
  //   state?.updateValueAndValidity();
  // }
  // submitOrder(form: FormGroup) {
  //   console.log('form.value :', form.value);
  //   // if (form.invalid) {
  //   //   this.placeOrderForm.markAllAsTouched();
  //   //   return;
  //   // }
  //   const payload = form.value;
  //   console.log('Final Payload:', payload);
  //   if (form.valid) {
  //     const fullAddress = form.value.address
  //       ? `${form.value.address}, ${form.value.address_line2 || ''}, ${
  //           form.value.city || ''
  //         }, ${form.value.state || ''}, ${this.patientZipcode}`
  //       : this.patientZipcode; // if address not provided, send only zipcode

  //     const payload = {
  //       patient_id: this.patientId,
  //       zipcode: this.patientZipcode,
  //       location_token: this.location_token,
  //       delivery_type: this.deliverytype,
  //       address: form.value.address,
  //       address_line2: form.value.address_line2,
  //       city: form.value.city,
  //       state: form.value.state,
  //       items: JSON.stringify(this.MedicineIds),
  //       full_address: fullAddress.trim(),
  //     };
  //     console.log('Final Payload:', payload);
  //     this.placeOrderS.createPatient(payload).subscribe({
  //       next: (response) => {
  //         if (response?.status_code === '0') {
  //           alert(response.status_message || 'Something went wrong.');
  //         }
  //         console.log('Order Response:', response);
  //         alert('Order placed successfully!');
  //       },
  //       error: (error) => {
  //         console.error('Error placing order:', error);
  //         alert('Failed to place order. Please try again.');
  //       },
  //     });
  //   }
  // }
}
