import { ChangeDetectorRef, Component } from '@angular/core';
import {Subscription} from 'rxjs';
import jwt_decode from 'jwt-decode';

// services
import {DataAccessService} from './services/data-access.service';
import {AuthenticationService} from './services/authentication.service';
import {StoreEventsService} from './services/store-events.service';
import {AnimalEventsService} from './services/animal-events.service';
import {PageService} from './services/page.service';
import { NotificationService } from './services/notification.service';
import { PageEventsService } from './services/page-events.service';

// models
import {Store} from './models/store.model';
import {UserLogin} from './models/user-login';
import { User } from './models/user';
import { Animal } from './models/animal.model';

// factories
import { NotificationFactory } from './factories/notification-factory';

const defaultBodyHeader: string = "Welcome to the Animal Adoption Center!"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // retrieved data
  centers: Store[];

  // state data
  selectedStore: Store | null;
  selectedAnimal: Animal;
  title = 'AnimalAdoptionCenterClient';
  bodyContentTitle = defaultBodyHeader;
  isBackBtnShowing: boolean = true;
  backBtnUrl: string = "";
  isAnimalInfoFormShowing: boolean = false;
  updatingAnimal = false;
  isAdminToolBarShowing: boolean = false;
  isLoginFormShowing = false;
  loggedInUser: User | null;

  noteFactory: NotificationFactory;

  // subscriptions
  storeSelectedEventSubscription: Subscription;
  animalSelectedEventSubscription: Subscription;
  animalInformationPageLoadedEventSubscription: Subscription;
  homePageLoadedEventSubscription: Subscription;
  centerPageLoadedEventSubscription: Subscription;
  centerAnimalsPageLoadedEventSubscription: Subscription;
  centerDetailsPageLoadedEventSubscription: Subscription;

  constructor(
    private changeDetector : ChangeDetectorRef,
    private dataService : DataAccessService, 
    private authService : AuthenticationService, 
    private storeEventsService : StoreEventsService,
    private animalEventsService : AnimalEventsService,
    private pageService : PageService,
    private noteService : NotificationService,
    private pageEventsService : PageEventsService
    ) {
      // create note factory
      this.noteFactory = new NotificationFactory(this.noteService);

      // check if the user is logged in
      this.initAuthCheck()

      // subscribe to the animal selected event
      this.animalEventsService.getAnimalSelectedEventAsObservable().subscribe(selectedAnimal => {
        this.selectedAnimal = selectedAnimal;
      })
    }

  ngOnInit(): void {
    // Bloater-LM
    
    // subscribe to the store selected event
    this.storeEventsService.getStoreSelectedEventAsObservable().subscribe(selectedStore => {
      // change the current store
      this.selectedStore = selectedStore;
    })

    // subscribe to when the home page component loads
    this.homePageLoadedEventSubscription = this.pageService.getHomePageLoadedEventAsObservable().subscribe(() => {
      // home component(page) loaded
      // remove the back btn
      this.hideBackBtn();
      // remove selected store
      this.selectedStore = null;
      // update body title
      this.bodyContentTitle = defaultBodyHeader;
      // fixed an error -> https://www.youtube.com/watch?v=O47uUnJjbJc
      this.changeDetector.detectChanges();
    })

    // subscribe to when the animal information page loads
    this.animalInformationPageLoadedEventSubscription = this.pageService.getAnimalInformationPageLoadedEventAsObservable().subscribe(animal => {
      // animal info page loaded
      // update the selected animal
      this.selectedAnimal = animal;
      this.dataService.getStoreById(this.selectedAnimal.storeId).then(storeFound => {
        this.selectedStore = storeFound;
        this.onAnimalInfoPageDataDefined();
      })
    })

    // subscribe to when center component loads
    this.centerPageLoadedEventSubscription = this.pageService.getCenterPageLoadedEventAsObservable().subscribe(storeLoaded => {
      // update selected store
      this.selectedStore = storeLoaded;
      this.setupBackBtn("/");
      // update body title
      this.bodyContentTitle = "Explore"
    })

    // subscribe to when animals component loads
    this.centerAnimalsPageLoadedEventSubscription = this.pageService.getCenterAnimalsPageLoadedEventAsObservable().subscribe(metaData => {
      // setup back btn
      this.setupBackBtn(`/centers/${metaData.store.storeId}/animals`);
      this.changeDetector.detectChanges();

      // update body title
      this.bodyContentTitle = metaData.animals[0].classificationName + 's';
    })

    // subscribe to when center details page loads
    this.centerDetailsPageLoadedEventSubscription = this.pageService.getCenterDetailsPageLoadedEventAsObservable().subscribe(() => {
      // setup back btn
      this.setupBackBtn('/');

      // update body title
      this.bodyContentTitle = "Center details"
      this.changeDetector.detectChanges();
    })

    // listen for when an animal's info is updated
    this.pageEventsService.animalDataUpdatedEvent.subscribe(updatedAnimal => {
      // close form
      this.toggleAnimalInformationForm(false);
    })

    // listen for when an animal is added
    this.pageEventsService.animalAddedEvent.subscribe(updatedAnimal => {
      // close form
      this.toggleAnimalInformationForm(false);
    })
  }

  hideBackBtn(){
    this.isBackBtnShowing = false;
  }

  /**
   * Runs after the animal information page loaded signal has been received and all the necessary data has been defined
   */
  onAnimalInfoPageDataDefined(){
    this.bodyContentTitle = this.selectedAnimal.name;
    this.setupBackBtn(`/centers/${this.selectedStore?.storeId}/animals/${this.selectedAnimal.classificationName}`);
  }

  setupBackBtn(url: string){
    this.isBackBtnShowing = true;
    this.backBtnUrl = url;
  }

  toggleAnimalInformationForm(state: boolean){
    this.isAnimalInfoFormShowing = state;
    if(!state){
      this.updatingAnimal = false;
    }
  }

  showAnimalUpdateForm(){
    this.isAnimalInfoFormShowing = true;
    this.updatingAnimal = true;
  }

  toggleAdminLoginForm(state: boolean){
    this.isLoginFormShowing = state;
  }

  authenticationBtnClickedHandler(){
    // check if a user is logged in
    if(this.loggedInUser != null){
      // logout user
      this.logout();
    }
    else{
      // show login form
      this.toggleAdminLoginForm(true);
    }
  }

  handleForgottenPassword(){
    alert("Contact your store's manager to reset your password.")
  }

  attemptLogin(user: UserLogin){
    // Bloater-LM - ?

    this.dataService.login(user).subscribe(response => {
      this.login(response.user);
    },
    error => {
      console.log("auth failed")

      if(error.status == 401){
        // failed creds
        // signal failed login attempt
        this.authService.signalFailedLoginEvent();

        // show error msg
        this.noteService.addNotification(this.noteFactory.genErrorNotification("Incorrect Credentials"))
      }
    })
  }

  login(userThatWasJustLoggedIn: User){
    // set current user
    this.loggedInUser = userThatWasJustLoggedIn;

    // close the login form
    this.isLoginFormShowing = false;

    // open the admin toolbar
    this.isAdminToolBarShowing = true;

    // signal authentication event
    this.authService.signalUserLoggedIn(true, userThatWasJustLoggedIn);

    // add notification
    this.noteService.addNotification(this.noteFactory.genSuccessNotification("Logged In"))
  }

  logout(){
    // close any authenticated components
    this.isAnimalInfoFormShowing = false;
    
    // send request to server
    this.dataService.logoutCurrentUser().subscribe(message => {
      console.log("server logout msg : ", message)
      // add notification
      this.noteService.addNotification(this.noteFactory.genCustomNotification("#153396", "Logged Out"))
    })

    // close the admin toolbar
    this.isAdminToolBarShowing = false;

    // remove the current logged in user data
    this.loggedInUser = null;

    // signal authentication event
    this.authService.signalUserLoggedIn(false);
  }

  private initAuthCheck() {
    // Bloater-LM - ?
    
    this.dataService.checkIfLoggedIn().subscribe(token => {
      // is logged in
      let decodedToken: any = jwt_decode(token);
      let userLoggedIn = new User();
      userLoggedIn.id = decodedToken.userId;
      userLoggedIn.username = decodedToken.unique_name;
      userLoggedIn.role = decodedToken.role;
      this.login(userLoggedIn);
    },
    err => {
      if(err.status == 401){
        // user not logged in
      }
      console.log(err)
    }
    )
  }
}
