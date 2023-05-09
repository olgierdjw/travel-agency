import {Component, OnInit} from '@angular/core';
import {Trip} from "../../models/trip";
import {Reservation} from "../../models/reservation";
import {ReservationsService} from "../../services/reservations.service";
import {OffersService} from "../../services/offers.service";

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  offers: Trip[] = [];
  reservations: Trip[] = [];
  private reservationData: Reservation[] = [];
  totalQuantity: number = 0;

  constructor(private reservationsService: ReservationsService, private offersService: OffersService) {
  }

  ngOnInit(): void {
    this.offersService.allTrips().subscribe((allOffers: Trip[]) => {
      this.offers = allOffers
      this.updateTrips()
    });

    this.reservationsService.getUserReservations().subscribe(
      (reservations: Reservation[]) => {
        this.reservationData = reservations;
        this.updateTrips();
      }
    );


  }

  private updateTrips() {
    let newTrips: Trip[] = [];
    let sum = 0;
    for (let res of this.reservationData) {
      let find: Trip | undefined = this.offers.filter((t: Trip) => t.id === res.trip_id).pop();
      // console.log(find)
      if (find) {
        sum += res.quantity;
        newTrips.push({...find, quantity: res.quantity})
      }
    }
    this.reservations = newTrips;
    this.totalQuantity = sum;
  }


  handleReservationDecrease(trip: Trip) {
    this.reservationsService.cancelReservation(trip);
  }
}
