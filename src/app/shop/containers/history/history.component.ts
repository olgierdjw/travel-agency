import {Component} from '@angular/core';
import {HistoryService} from "../../services/history.service";
import {History} from "../../models/history";
import {Trip} from "../../models/trip";
import {OffersService} from "../../services/offers.service";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent {
    history: History[] = [];
    trips: Trip[] = [];

    filteredHistory: History[] = [];
    showBefore: boolean = true;
    showCurrent: boolean = true;
    showAfter: boolean = true;


    constructor(private historyService: HistoryService, private offersService: OffersService) {
        this.historyService.userHistory().subscribe((data: History[]) => {
            this.history = data;
            this.filterTrips();
        });
        this.offersService.allTrips().subscribe((data: Trip[]) => {
            this.trips = data;
            this.filterTrips();
        });

    }

    filterTrips() {
        let today = new Date();
        let filteredList: History[] = [];
        this.history.map((orderDetails: History) => {
            let trip = this.getTripById(orderDetails.offerId);
            let tripStart = new Date(trip?.startDate as string);
            let tripEnd = new Date(trip?.endDate as string);
            if (today < tripStart && this.showBefore)
                filteredList.push(orderDetails);
            if (tripEnd < today && this.showAfter)
                filteredList.push(orderDetails);
            if (tripStart <= today && today <= tripEnd && this.showCurrent)
                filteredList.push(orderDetails);
        })
        this.filteredHistory = filteredList;
    }

    getTripById(id: string): Trip | undefined {
        return this.trips.find((t: Trip) => t.id === id);
    }

    tripStatus(id: string): string {
        let trip: Trip | undefined = this.getTripById(id);
        if (trip) {
            let today = new Date();
            let startDate = new Date(trip.startDate as string);
            let endDate = new Date(trip.endDate as string);

            if (today < startDate)
                return 'before';
            else if (startDate <= today && today <= endDate)
                return 'in progress';
            else
                return 'completed';

        }
        return 'status ' + id
    }

}
