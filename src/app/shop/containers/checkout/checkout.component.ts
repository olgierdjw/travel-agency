import {Component, OnInit} from '@angular/core';
import {Trip} from "../../models/trip";
import {Reservation} from "../../models/reservation";
import {ReservationsService} from "../../services/reservations.service";
import {OffersService} from "../../services/offers.service";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    total = new Map<String, { q: number, price: number, tripId: string, reservationId: string }>();
    totalSum: number = 0;
    private offers: Trip[] = [];
    private calculateBasedOn: Reservation[] = [];

    constructor(private reservationsService: ReservationsService, private offersService: OffersService) {
    }

    ngOnInit(): void {
        this.offersService.allTrips().subscribe((trips: Trip[]) => {
            this.offers = trips
            this.calculateBill()
        });
        this.reservationsService.getUserReservations().subscribe(
            (reservations: Reservation[]) => {
                this.calculateBasedOn = reservations;
                this.calculateBill();
            })
    }

    calculateBill() {
        console.log("CALCULATE");
        console.log(this.offers);
        console.log(this.calculateBasedOn);
        let newTotal = new Map<String, { q: number, price: number, tripId: string, reservationId: string }>();
        let newSum = 0;
        this.calculateBasedOn
            .map((r: Reservation) => {
                    let exist = this.offers.filter((t: Trip) => t.id === r.trip_id)[0];
                    if (!exist)
                        return
                    // @ts-ignore
                    newTotal.set(exist.name, {
                        q: r.quantity,
                        price: this.tripPrice(r.trip_id),
                        tripId: r.trip_id,
                        reservationId: r.reservation_id as string
                    });
                    newSum += r.quantity * this.tripPrice(r.trip_id);
                }
            )
        this.totalSum = newSum;
        this.total = newTotal;
    }

    buyButton(tripId: string, reservationId: string) {
        this.reservationsService.buyTrip(tripId, reservationId);
    }

    private tripPrice(tripId: string): number {
        return this.offers.filter((i) => i.id === tripId)[0].price;
    }


}
