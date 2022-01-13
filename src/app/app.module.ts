import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { HomeComponent } from './pages/home/home.component';
import { StoreCardComponent } from './components/store-card/store-card.component';
import { CenterComponent } from './pages/center/center.component';
import { AnimalCategoryCardComponent } from './components/animal-category-card/animal-category-card.component';
import { AnimalCardComponent } from './components/animal-card/animal-card.component';
import { AnimalsComponent } from './pages/animals/animals.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminLoginFormComponent } from './components/admin-login-form/admin-login-form.component';
import { AdminToolBarComponent } from './components/admin-tool-bar/admin-tool-bar.component';
import { AdminToolBtnComponent } from './components/admin-tool-btn/admin-tool-btn.component';
import { AnimalInformationFormComponent } from './components/animal-information-form/animal-information-form.component';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { AnimalInformationComponent } from './pages/animal-information/animal-information.component';
import {HttpClientModule} from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CenterDetailsComponent } from './pages/center-details/center-details.component';
import { CenterTextDetailsComponent } from './components/center-text-details/center-text-details.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { AddPicturesFormComponent } from './components/add-pictures-form/add-pictures-form.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationManagerComponent } from './components/notification-manager/notification-manager.component';
import { EditStoreFormComponent } from './components/edit-store-form/edit-store-form.component';

const Routes = [
  {
      path: '',
      component: HomeComponent
  },
  {
    path: 'centers/:centerId',
    component: CenterDetailsComponent
  },
  {
    path: 'centers/:centerId/animals/:classification',
    component: AnimalsComponent
  },
  {
    path: 'animals/:animalId',
    component: AnimalInformationComponent
  },
  {
    path: 'centers/:centerId/animals',
    component: CenterComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    NavItemComponent,
    HomeComponent,
    StoreCardComponent,
    CenterComponent,
    AnimalCategoryCardComponent,
    AnimalCardComponent,
    AnimalsComponent,
    AdminLoginFormComponent,
    AdminToolBarComponent,
    AdminToolBtnComponent,
    AnimalInformationFormComponent,
    ConfirmPopupComponent,
    AnimalInformationComponent,
    SpinnerComponent,
    CenterDetailsComponent,
    CenterTextDetailsComponent,
    AddButtonComponent,
    AddPicturesFormComponent,
    NotificationComponent,
    NotificationManagerComponent,
    EditStoreFormComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    RouterModule.forRoot(Routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
