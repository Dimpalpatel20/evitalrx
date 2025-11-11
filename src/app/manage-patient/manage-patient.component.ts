import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PatientService } from '../services/patient.service';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutService } from '../services/checkout.service';
import { CheckserviceabilityService } from '../services/checkserviceability.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule ,
    MatCheckboxModule,
  ],
  templateUrl: './manage-patient.component.html',
  styleUrl: './manage-patient.component.css',
})
export class ManagePatientComponent {
  patientData: any = [];
  viewPatient!: FormGroup;

  loading = false;
  errorMsg: string = '';
  // displayedColumns: string[] = ['name', 'mobile', 'age', 'gender'];
  selectedMedicines: any;
displayedColumns: string[] = [
    'medicine_name',
    'pack_size',
    'mrp',
    'medicine_name_suggest',
  ];
    // 4 delivery-service
    // quick : delivery within 30 mins.
    // regular : delivery within 2 hour.
    // same_day : delivery within 24 hour.
    // pan_india : delivery within 5-7 days varies upon distance

    serviceTypes: any[] = ['regular', 'same_day', 'quick', 'pan_india'];
      // deliveryType: string = '';

  selectedServiceTypes: string[] = [];
patientId:any;
patientZipcode:any
  selectedMedicineIds: any;
  checkserviceabilityResponse: any;
  locationToken: any;
  serviceabilityMessage: string ='';
  serviceabilityType: string='';
  checkoutResponse: any;
  constructor(
    private fb: FormBuilder,
    private patientS: PatientService,
    private _router: Router,
    private cartS:CartService,
    private checkoutS:CheckoutService,
    private check_serviceabilityS: CheckserviceabilityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.viewPatient = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
      this.selectedMedicines = this.cartS.getMedicines();

    //  const nav = this._router.getCurrentNavigation();
  // this.selectedMedicines = nav?.extras?.state?.['selectedMedicines'] || [];
  console.log('Received Medicines:', this.selectedMedicines);

  }

  searchPatient() {
    (this.loading = true),
      this.patientS.viewPatientDetail(this.viewPatient.value.mobile).subscribe({
        next: (res: any) => {
          if (res?.status_code === '0') {
            this.loading = false;
            this.patientData = [];
            alert(res.status_message || 'Something went wrong.');
            return;
          }
          this.loading = false;
          this.patientData = res.data;
          console.log('Patient Details:', res);
          this.cartS.setPatientData(this.patientData)

          console.log('Patient id :',res.data[0].patient_id);
          console.log("Zipcode :",res.data[0].zipcode);
          this.patientId = res.data[0].patient_id
          this.patientZipcode=res.data[0].zipcode;
        },
        error: (err: any) => {
          console.error('Error fetching patient:', err);
        },
      });
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
  checkServiceability(){
 const serviceabilityPayload: any = {
      zipcode: this.patientZipcode,
      service_type: JSON.stringify(this.selectedServiceTypes), 
      latitude: "23.1025849",     // ,  "12.970612"
      longitude: "72.5953601", //   ,      77.6382433
    };
    console.log('Serviceability Payload:', serviceabilityPayload);
    this.check_serviceabilityS
      .checkServiceability(serviceabilityPayload)
      .subscribe({
        next: (res: any) => {
          if (res?.status_code === '0') {
            alert(res.status_message || 'Something went wrong.');
            return;
          }
          this.checkserviceabilityResponse = res.data;
          console.log('this.checkserviceabilityResponse:',this.checkserviceabilityResponse);
          this.locationToken = this.checkserviceabilityResponse?.regular?.location_token ||
    this.checkserviceabilityResponse?.same_day?.location_token ||
      this.checkserviceabilityResponse?.pan_india?.location_token ||
        this.checkserviceabilityResponse?.quick?.location_token ||
    null;
          console.log('this.locationToken :', this.locationToken);
          this.cartS.setLocationToken(this.locationToken);
 const regular = res.data?.regular;
    const sameDay = res.data?.same_day;
    const pan_india =res.data?.pan_india;
    const quick = res.data?.quick;
     if (regular?.serviceable || sameDay?.serviceable || quick?.serviceable || pan_india?.serviceable) {
      // this.serviceabilityMessage = 'Pharmacy service is available for your location!.';
      this.serviceabilityType = 'success';

      // Optional Snackbar
      this.snackBar.open('Pharmacy service available!', 'Close', {
        duration: 6000,
        panelClass: ['snackbar-success']
      });

    } else {
      // not available
      // this.serviceabilityMessage = 'No pharmacy service available at your location.';
      this.serviceabilityType = 'error';

      this.snackBar.open('No pharmacy service found for your area.', 'Close', {
        duration: 6000,
        panelClass: ['snackbar-error']
      });
    }
  
        },
        error: (err) => {
          this.errorMsg = 'Failed to fetch checkout details';
          console.error(err);
        },
      });
  }
  moveToCheckout() {
    this.errorMsg = '';
    // this.checkoutResponse = null;
    // console.log('Patient ID:', this.patientId);
    
    console.log('selectedMedicineIds :', this.selectedMedicineIds);

    if (!this.selectedMedicines.length) {
      this.errorMsg = 'Please add medicines to cart first.';
      return;
    }

    const items = this.selectedMedicines.map((med: any) => ({
      medicine_id: med.medicine_id,
      quantity: med.quantity || 1,
    }));
    const payload = {
      // patient_id: this.patientId,
      items: JSON.stringify(items),
      latitude: 23.1025849, // 22.7196
      longitude: 72.5953601, //75.8577
      zipcode: '452001',
      find_alternative: true,
      show_cart_options: true,
      location_token: this.locationToken,
      // delivery_type: this.deliveryType,
    };
    console.log('payload :', payload);

    this.checkoutS.checkout(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.status_code === '0') {
          alert(res.status_message || 'Something went wrong.');
          return;
        }
        if (!res?.data) {
          this.errorMsg = 'No checkout data received.';
          return;
        }
        this.checkoutResponse = res.data;
this.cartS.setCheckoutRes(this.checkoutResponse)
this._router.navigate(['/dashboard/checkout'])
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Failed to fetch checkout details';
        console.error(err);
      },
    });
  }
  addPatient(){
    this._router.navigate(['/dashboard/add-patient'])
  }
}
