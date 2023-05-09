import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Trip} from "../../models/trip";
import {Reservation} from "../../models/reservation";
import {NgForm} from "@angular/forms";
import {OffersService} from "../../services/offers.service";
import {ReservationsService} from "../../services/reservations.service";

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.css']
})
export class OfferDetailsComponent implements OnInit {

  trip!: Trip;
  tripReservation: Reservation | undefined;
  // @ts-ignore
  localCommentList: [{ nick: string, comment: string, date?: string }] = [];
  urlList: string[] = ["https://wallpapercave.com/wp/wp3473585.jpg",
    "https://static.vecteezy.com/system/resources/previews/000/207/535/original/desert-road-trip-vector.jpg",
    "https://thetravelexpert.ie/wp-content/uploads/2019/05/shutterstock_358226087-compressor.jpg"];
  currentUrl: string = "https://wallpapercave.com/wp/wp3473585.jpg";

  constructor(private route: ActivatedRoute, private offersService: OffersService, private reservationsService: ReservationsService) {

  }

  ngOnInit(): void {
    let tripId = this.route.snapshot.paramMap.get('id');
    this.offersService.allTrips().subscribe((trips: Trip[]) => {
      this.trip = trips.filter((t: Trip) => t.id == tripId)[0];
      this.findReservation();
    })
    this.reservationsService.getUserReservations().subscribe(() => this.findReservation())

  }

  addButton() {
    this.reservationsService.makeReservation(this.trip);
  }

  decrementReservation() {
    this.reservationsService.cancelReservation(this.trip);
  }

  handleSubmit(form: NgForm) {
    this.localCommentList.push({nick: form.value.name, comment: form.value.comment, date: form.value.date})
    form.resetForm();
  }

  changePicture() {
    let lastIndex: number = 0;
    this.urlList.map((s: string, index: number) => {
      if (s === this.currentUrl)
        lastIndex = index;
    });
    lastIndex += 1;
    this.currentUrl = this.urlList[lastIndex % this.urlList.length];
  }

  private findReservation() {
    if (this.trip)
      this.tripReservation = this.reservationsService.getReservationByTrip(this.trip.id as string);
  }

}
