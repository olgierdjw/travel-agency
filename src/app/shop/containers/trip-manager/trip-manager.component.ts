import {Component} from '@angular/core';
import {Trip} from "../../models/trip";
import {OffersService} from "../../services/offers.service";

@Component({
    selector: 'app-trip-manager',
    templateUrl: './trip-manager.component.html',
    styleUrls: ['./trip-manager.component.css']
})
export class TripManager {

    tripToEdit: Trip | null = null;
    trips;

    constructor(private offersService: OffersService) {
        this.trips = offersService.allTrips();
    }

    handleDeleteButton(trip: Trip) {
        this.offersService.delete(trip);
    }


    handleTripSend(trip: Trip) {
        if (this.tripToEdit)
            this.editItem(trip);
        else
            this.createNewDatabaseItem(trip);
    }

    handleRowEditButton(trip: Trip) {
        this.tripToEdit = trip;
    }

    createNewDatabaseItem(data: any) {
        this.offersService.addOffer(data);
    }

    editItem(data: any) {
        // this.tripService.edit(data);
    }


}
