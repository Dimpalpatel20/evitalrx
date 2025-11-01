import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaceorderComponent } from './NavbarMenus/placeorder/placeorder.component';
import { CheckoutComponent } from './NavbarMenus/checkout/checkout.component';
import { AddPatientComponent } from './NavbarMenus/add-patient/add-patient.component';
import { MedicineComponent } from './dashboard/medicine/medicine.component';
import { ManagePatientComponent } from './manage-patient/manage-patient.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'dashboard',
    children: [
      //  Default route
      { path: '', redirectTo: 'medicine', pathMatch: 'full' },

      //  Child routes
      { path: 'medicine', component: MedicineComponent, title: 'Home' },
      {
        path: 'place-order',
        component: PlaceorderComponent,
        title: 'place-order',
      },
      { path: 'checkout', component: CheckoutComponent, title: 'checkout' },
      {
        path: 'add-patient',
        component: AddPatientComponent,
        title: 'add-patient',
      },
      {
        path: 'manage-patient',
        component: ManagePatientComponent,
        title: 'Manage-patient',
      },
    ],
  },
];
