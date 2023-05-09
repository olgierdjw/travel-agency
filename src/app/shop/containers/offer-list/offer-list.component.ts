import {Component, OnInit} from '@angular/core';
import {Trip} from "../../models/trip";
import {Reservation} from "../../models/reservation";
import {OffersService} from "../../services/offers.service";
import {ReservationsService} from "../../services/reservations.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-offer-list',
    templateUrl: './offer-list.component.html',
    styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {
    offers: Trip[] = [];
    reservations: Reservation[] = [];
    minPriceValue: number = 0;
    maxPriceValue: number = 0;

    activeUser: boolean = false;

    constructor(private userService: UserService,
                private offersService: OffersService,
                private reservationsService: ReservationsService) {
    }

    ngOnInit(): void {
        this.offersService
            .allTrips()
            .subscribe((trips: Trip[]) => {
                this.offers = trips
                this.maxPriceValue = this.maxPrice();
                this.minPriceValue = this.minPrice();
            })
        this.reservationsService.getUserReservations()
            .subscribe((r: Reservation[]) => {
                this.reservations = r
                this.maxPriceValue = this.maxPrice();
                this.minPriceValue = this.minPrice();
            })
        this.userService.getUser()
            .subscribe(value => this.activeUser = !!value)
    }

    showDeleteReservationButton(trip: Trip) {
        let reserved = this.reservations.filter((r: Reservation) => r.trip_id === trip.id)[0]
        return !!reserved;

    }

    handleReservation(trip: Trip, add: boolean) {
        if (add)
            this.reservationsService.makeReservation(trip);
        else
            this.reservationsService.cancelReservation(trip);
    }

    handleDeleteTrip(trip: Trip) {
        this.offersService.delete(trip);
    }

    private minPrice() {
        let filter = this.offers.filter((t: Trip) => t.quantity > 0);
        return Math.max(...filter.map(t => t.price))
    }

    private maxPrice() {
        let filter = this.offers.filter((t: Trip) => t.quantity > 0);
        return Math.min(...filter.map(t => t.price))
    }

}

