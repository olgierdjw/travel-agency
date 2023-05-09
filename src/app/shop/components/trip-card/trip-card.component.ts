import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Trip} from "../../models/trip";

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css']
})
export class TripCardComponent {
  @Input() trip!: Trip;
  @Input() canDelete!: boolean;
  @Input() previewOnly!: boolean;
  @Output() reservationAdd = new EventEmitter<Trip>();
  @Output() reservationRemove = new EventEmitter<Trip>();
  @Output() deleteTrip = new EventEmitter<Trip>();

  handleReservationIncrease() {
    this.reservationAdd.emit(this.trip);
  }

  handleReservationDecrease() {
    this.reservationRemove.emit(this.trip);
  }

}
