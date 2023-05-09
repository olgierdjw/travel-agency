import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from "@angular/router";
import {ValidAccount} from "./shop/guard/valid-account.service";

// components
import {AppComponent} from './app.component';
import {ShopModule} from "./shop/shop.module";
import {OfferListComponent} from "./shop/containers/offer-list/offer-list.component";
import {NavbarComponent} from './shop/components/navbar/navbar.component';
import {HomePageComponent} from "./shop/containers/home-page/home-page.component";
import {HistoryComponent} from "./shop/containers/history/history.component";
import {OfferDetailsComponent} from "./shop/containers/offer-details/offer-details.component";


// Firebase
import {environment} from "../assets/environment";
import {CheckoutComponent} from "./shop/containers/checkout/checkout.component";
import {AngularFireModule} from '@angular/fire/compat';
import {AdminPanelComponent} from "./shop/components/admin-panel/admin-panel.component";
import {UserAuthPanelComponent} from "./shop/containers/user-auth-panel/user-auth-panel.component";
import {TripManager} from "./shop/containers/trip-manager/trip-manager.component";

export const routes: Routes = [
    {path: 'user', component: UserAuthPanelComponent},
    {path: 'trip/:id', component: OfferDetailsComponent, canActivate: [ValidAccount]},
    {path: 'offers', component: OfferListComponent},
    {path: 'home', component: HomePageComponent},
    {path: 'buy', component: CheckoutComponent, canActivate: [ValidAccount]},
    {path: 'history', component: HistoryComponent, canActivate: [ValidAccount]},
    {path: 'trip-manager', component: TripManager},
    {path: 'admin', component: AdminPanelComponent, canActivate: [ValidAccount]},
    {path: '**', redirectTo: 'home'}
]

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
    ],
    imports: [
        BrowserModule, ShopModule, RouterModule.forRoot(routes),
        AngularFireModule.initializeApp(environment.firebaseConfig)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
