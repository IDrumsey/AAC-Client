import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loggedInUser: User | null = null;

  // https://jasonwatmore.com/post/2019/02/07/angular-7-communicating-between-components-with-observable-subject

  // events

  // event that indicates a user just logged in or out
  loginOrLogoutEvent = new Subject<boolean>();

  // event that indicates failed login attempt
  failedLoginEvent = new Subject<any>();

  constructor() { }

  /**
   * Signals observer that a user has either logged in or logged out
   * @param login True if a user logged in and false if a user logged out
   */
  signalUserLoggedIn(login: boolean, user?: User) {
    this.loginOrLogoutEvent.next(login);

    // set the user if logging in
    this.loggedInUser = user as User;
  }

  isUserLoggedIn() {
    return this.loggedInUser != null;
  }

  /**
   * returns the loginOrLogoutEvent as an observable
   * @returns Observable
   */
  provideAuthenticationEventTracker() {
    return this.loginOrLogoutEvent.asObservable();
  }

  signalFailedLoginEvent() {
    this.failedLoginEvent.next();
  }

  getFailedLoginEventObservable() {
    return this.failedLoginEvent.asObservable();
  }
}
