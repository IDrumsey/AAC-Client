import { Component, OnInit } from '@angular/core';
import {Store} from '../../models/store.model'
import {DataAccessService} from '../../services/data-access.service';
import {StoreEventsService} from '../../services/store-events.service';
import {Router} from '@angular/router'
import {PageService} from '../../services/page.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stores: Store[];

  constructor(private dataService: DataAccessService, private storeEventsService: StoreEventsService, private router: Router, private pageService: PageService) { }

  ngOnInit(): void {
    this.dataService.getAllStores().then(stores => {
      this.stores = stores;
      this.signalPageLoaded();
    })
  }

  signalPageLoaded(){
    this.pageService.signalHomePageLoadedEvent();
  }

  storeCardClickHandler(store: Store){
    // signal a store has been selected
    this.storeEventsService.signalStoreSelectedEvent(store);
    // route to center page
    this.router.navigate(['/centers', store.storeId])
  }
}
