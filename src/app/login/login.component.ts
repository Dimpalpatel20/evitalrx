import { V } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterConfigOptions, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(private _fb: FormBuilder,private _router:Router) {
    console.log('constructor called!');
  }
  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.maxLength(6), Validators.required]],
    });
  }
  login(form: FormGroup) {
    console.log('Logged Items:', form.value);
    if (
      form.value.email === 'evitalrx@mail.com' &&
      form.value.password === 'evital'
    ) {
      localStorage.setItem('islogged', 'true');
      console.log('Login success: stored islogged=true');
        this._router.navigate(['dashboard'])
    } else {
      localStorage.setItem('islogged', 'false');
      console.log('Login success: stored islogged=false');
    }
  }
}
