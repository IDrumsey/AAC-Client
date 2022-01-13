import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {faWindowClose} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// models
import {UserLogin} from '../../models/user-login';

// services
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-admin-login-form',
  templateUrl: './admin-login-form.component.html',
  styleUrls: ['./admin-login-form.component.css']
})
export class AdminLoginFormComponent implements OnInit {
  closeBtn = faWindowClose;
  
  form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  loginFailedMsg: string | null;

  // subscriptions
  failedLoginEventSubscription: Subscription;

  // events
  @Output() loginFormCloseBtnClickEvent = new EventEmitter();
  @Output() forgotPasswordBtnClickEvent = new EventEmitter();
  @Output() submitBtnClickEvent = new EventEmitter<UserLogin>();

  constructor(private authService: AuthenticationService) {
    // subscribe to failed login events
    this.failedLoginEventSubscription = this.authService.getFailedLoginEventObservable().subscribe(() => {
      // update error msg
      this.loginFailedMsg = "Something went wrong"
    })
  }

  ngOnInit(): void {
  }

  onCloseClick(){
    this.loginFormCloseBtnClickEvent.emit();
  }

  onForgotPasswordClick(){
    this.forgotPasswordBtnClickEvent.emit();
  }

  onFormSubmitClick(){
    // map fields to UserLogin object
    let userFields = new UserLogin();
    userFields.username = this.form.controls['username'].value;
    userFields.password = this.form.controls['password'].value;

    this.submitBtnClickEvent.emit(userFields);
  }
}
