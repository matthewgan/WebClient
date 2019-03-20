import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMessage: string;

    constructor(
      //private formBuilder: FormBuilder,
      //private router: Router,
      //private authService: AuthService
    ) {}

    ngOnInit() {
      //this.buildForm();
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'false');
    }
}
