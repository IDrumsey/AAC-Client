import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {faUserCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {Store} from '../../models/store.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  websiteTitle: string = "Animal Adoption Center";
  @Input() selectedCenter: Store | null;
  signInBtn = faUserCog;
  signOutBtn = faSignOutAlt;
  currentBtn = this.signInBtn;

  // subscriptions
  authenticationEventSubscription: Subscription;

  // events
  @Output() authenticationBtnClickEvent = new EventEmitter();

  constructor(private router : Router, private authService : AuthenticationService) {
    // subscribe to authentication events through the authentication service
    this.authenticationEventSubscription = this.authService.provideAuthenticationEventTracker().subscribe(login => {
      if(login){
        // user logged in -> change btn if necessary
        this.currentBtn = this.signOutBtn;
      }
      else{
        // user logged out -> change btn if necessary
        this.currentBtn = this.signInBtn;
      }
    })
  }

  ngOnInit(): void {
  }

  logoClickHandler(){
    this.router.navigate(['']);
  }

  onAuthenticationBtnClick(){
    this.authenticationBtnClickEvent.emit();
  }
}
