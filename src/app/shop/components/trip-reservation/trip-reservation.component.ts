import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trip} from "../../models/trip";

@Component({
  selector: 'app-trip-reservation',
  templateUrl: './trip-reservation.component.html',
  styleUrls: ['./trip-reservation.component.css']
})
export class TripReservationComponent {
  @Input() trip!: Trip;
  @Output() tripDecrease = new EventEmitter<Trip>();

  handleTripDecrease(){
    this.tripDecrease.emit(this.trip);
  }
}
