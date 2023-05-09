import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TripCardComponent} from './components/trip-card/trip-card.component';
import {OfferListComponent} from './containers/offer-list/offer-list.component';
import {ReservationListComponent} from './containers/reservation-list/reservation-list.component';
import {TripReservationComponent} from './components/trip-reservation/trip-reservation.component';
import {SearchComponent} from './components/search/search.component';
import {CheckoutComponent} from './containers/checkout/checkout.component';
import {TripManager} from './containers/trip-manager/trip-manager.component';
import {AddTripComponent} from './components/offer-form/trip-manager-components.component';
import {FormsModule} from "@angular/forms";
import {HomePageComponent} from './containers/home-page/home-page.component';
import {RouterLink, RouterModule} from "@angular/router";
import { HistoryComponent } from './containers/history/history.component';
import { OfferDetailsComponent } from './containers/offer-details/offer-details.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserAuthPanelComponent } from './containers/user-auth-panel/user-auth-panel.component';


@NgModule({
  declarations: [
    TripCardComponent,
    OfferListComponent,
    ReservationListComponent,
    TripReservationComponent,
    SearchComponent,
    CheckoutComponent,
    TripManager,
    AddTripComponent,
    HomePageComponent,
    HistoryComponent,
    OfferDetailsComponent,
    AdminPanelComponent,
    UserAuthPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule
  ],
  exports: [OfferListComponent, TripReservationComponent, ReservationListComponent, CheckoutComponent]
})
export class ShopModule {
}
