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
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css',
})
export class AddPatientComponent {
    displayedColumns: string[] = ['first_name', 'last_name', 'mobile', 'dob', 'gender', 'blood_group'];
  patients: any[] = [];
   searchMobile: string = '';
  createPatient!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private patientS: PatientService
  ) {}

  ngOnInit() {
    this.createPatient = this._fb.group({
      first_name: ['', Validators.required],
      last_name: [''],
      dob: [''],
      gender: [''],
      blood_group: [''],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      zipcode: [null],
      full_address: [''],
    });
  }


  

  addPatient(form: FormGroup) {
    console.log('Patient Data:', form.value);
    const formValue = form.value;
    if (form.valid) {
      const formattedDOB = formValue.dob
        ? new Date(formValue.dob).toISOString().split('T')[0]
        : null;

      const payload = {
        zipcode: formValue.zipcode ? formValue.zipcode : '',
        // zipcode: formValue.zipcode ? Number(formValue.zipcode) : null,

         mobile: formValue.mobile,
        // mobile: Number(formValue.mobile),
        first_name: formValue.first_name.trim(),
        last_name: formValue.last_name?.trim() || '',
        dob: formattedDOB,
        gender: formValue.gender?.toLowerCase() || '',
        blood_group: formValue.blood_group?.toUpperCase() || '',
        full_address:formValue.full_address || ''
      };

      console.log('Final Payload:', payload);
      this.patientS.createPatient(payload).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          alert('Patient added successfully!');
          form.reset();
        },
        error: (error) => {
          console.error('API Error:', error);
          alert('Failed to add patient. Please try again.');
        },
      });
      // alert('Patient added successfully!');
      // form.reset();
    }
  }
}
