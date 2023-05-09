import {Component} from '@angular/core';
import {HistoryService} from "../../services/history.service";
import {Router} from "@angular/router";
import {Reservation} from "../../models/reservation";
import {History} from "../../models/history";
import {Trip} from "../../models/trip";
import {UserService} from "../../services/user.service";
import {UserState} from "../../models/userState";
import {OffersService} from "../../services/offers.service";
import {ReservationsService} from "../../services/reservations.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    incomingTrips: number = 0;
    rows: number = 0;
    totalQuantity: number = 0;
    userData: UserState | undefined = undefined;
    private trips!: Trip[];
    private history!: History[];

    constructor(private historyService: HistoryService,
                private router: Router, private reservationsService: ReservationsService,
                private offersService: OffersService,
                private user: UserService) {
        reservationsService.getUserReservations().subscribe((reservations: Reservation[]) => {
            this.rows = reservations.length;
            let newQuantity = 0;
            reservations.map((r: Reservation) => newQuantity += r.quantity);
            this.totalQuantity = newQuantity;
        })

        user.getUserData().subscribe((userData: UserState | null) => {
            if (userData)
                this.userData = userData;
            else
                this.userData = undefined;
        });

        offersService.allTrips().subscribe((d) => {
            this.trips = d;
            this.getNotificationCounter()
        });
        historyService.userHistory().subscribe((d) => {
            this.history = d;
            this.getNotificationCounter()
        });
    }

    basketButton() {
        this.router.navigate(['/buy']);
    }

    userPageLink() {
        this.router.navigate(['/user']);
    }

    showLoginButton() {
        return this.router.url !== '/user';
    }

    handleLogout() {
        this.user.signOut();
    }

    showManagerButton(): boolean {
        if (this.userData)
            return this.userData.rank.includes(1);
        return false;
    }

    showHistoryButton(): boolean {
        return !!this.userData;

    }

    showAdminButton(): boolean {
        if (this.userData)
            return this.userData.rank.includes(2);
        return false;
    }

    getNotificationCounter() {
        let cnt = 0;
        let today = new Date();
        if (!this.history) {
            return
        }
        this.history.map((orderDetails: History) => {
            let trip = this.getTripById(orderDetails.offerId);
            if (today < new Date(trip?.startDate as string))
                cnt += 1
        })
    }

    getTripById(id: string): Trip | undefined {
        if (id == undefined)
            return undefined
        return this.trips.filter((t: Trip) => t.id === id)[0];
    }

}
