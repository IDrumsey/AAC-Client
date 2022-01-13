import { Component, OnInit, Input } from '@angular/core';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons'
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  navItems = [
    "Schedule a visit",
    "See the animals"
  ]
  backBtn = faLongArrowAltLeft;
  @Input() backBtnUrl: string;
  @Input() showingBackBtn: boolean;

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  backBtnClickHandler(){
    this.router.navigateByUrl(this.backBtnUrl);
  }
}
