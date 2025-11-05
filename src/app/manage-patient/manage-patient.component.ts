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
  ],
  templateUrl: './manage-patient.component.html',
  styleUrl: './manage-patient.component.css',
})
export class ManagePatientComponent {
  patientData: any = [];
  viewPatient!: FormGroup;

  loading = false;
  errorMsg: string = '';
  displayedColumns: string[] = ['name', 'mobile', 'age', 'gender'];

  constructor(
    private fb: FormBuilder,
    private patientS: PatientService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.viewPatient = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
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
        },
        error: (err: any) => {
          console.error('Error fetching patient:', err);
        },
      });
  }

  moveForMedicine() {
    if (this.patientData && this.patientData.length > 0) {
      const patient = this.patientData[0];
      localStorage.setItem('selectedPatient', JSON.stringify(patient));
      this._router.navigate(['/dashboard/medicine']);
    }
  }
}
