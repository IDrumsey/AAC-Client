import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '../../models/store.model';
import {faPaw} from '@fortawesome/free-solid-svg-icons';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-store-card',
  templateUrl: './store-card.component.html',
  styleUrls: ['./store-card.component.css'],
  animations: [
    trigger("togglePawAnimation", 
    [
      state("showing", style({
        opacity: 1
      })),
      state("notShowing", style({
        opacity: 0
      })),
      transition("notShowing <=> showing", animate("100ms ease-in"))
    ]
    )
  ]
})
export class StoreCardComponent implements OnInit {
  @Input() data: Store;
  showSpinner: boolean = true;
  pawIcon = faPaw;
  showPaw = false;
  pawState = "notShowing";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getPicturePath(): string{
    if(this.data.pictures.length == 0){
      return "pexels-binyamin-mellish-1500459-1626538359242.jpg";
    }
    else{
      return this.data.pictures[0].path;
    }
  }

  togglePaw(on: boolean){
    // I-4
    this.pawState = on ? "showing" : "notShowing";
  }

  onPawClick(){
    // route to animals page
    this.routeToAnimalsPage();
  }

  routeToAnimalsPage(){
    this.router.navigate(['centers', this.data.storeId, 'animals'])
  }

  onImageLoad(){
    this.showSpinner = false;
  }
}
