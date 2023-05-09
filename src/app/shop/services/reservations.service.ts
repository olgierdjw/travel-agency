import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {UserService} from "./user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Reservation} from "../models/reservation";
import {Trip} from "../models/trip";
import {History} from "../models/history";
import {OffersService} from "./offers.service";

@Injectable({
    providedIn: 'root'
})
export class ReservationsService {

    private user$;
    private userId?: string;
    private reservations$ = new BehaviorSubject<Reservation[]>([]);
    private readonly userReservations: Observable<Reservation[]> = new BehaviorSubject<Reservation[]>([]);


    constructor(private userService: UserService, private firestore: AngularFirestore, private offersService: OffersService) {
        firestore.collection('reservations')
            .snapshotChanges()
            .subscribe((firebaseMetadata) => {
                    let reservations: Reservation[] = [];
                    for (let item of firebaseMetadata) {
                        let object: Reservation = item.payload.doc.data() as Reservation;
                        object.reservation_id = item.payload.doc.id;
                        object = object as Reservation;
                        reservations.push(object)
                    }
                    this.reservations$.next(reservations);
                }
            );


        this.user$ = userService.getUser();
        userService.getUser().subscribe(user => {
            if (user) this.userId = user.user_id;
        });


        this.userReservations = combineLatest([this.user$, this.reservations$]).pipe(
            map(
                ([new_user, new_history]) => {
                    if (!new_user)
                        return [] as Reservation[];
                    else {
                        return [...this.reservations$.value.filter((h) => h.client_id === new_user.user_id)]
                    }
                }
            )
        );
    }

    getUserReservations(): Observable<Reservation[]> {
        return this.userReservations;
    }


    buyTrip(offerId: string, reservation: string) {
        if (!this.userId) {
            console.warn("USER REQUIRED.")
            return;
        }
        let historyObject: History = {
            quantity: this.reservations$.value.find((r: Reservation) => r.reservation_id == reservation)!.quantity,
            orderDate: '01-10-2023',
            offerId: offerId,
            clientUID: this.userId as string
        }
        this.firestore.collection('reservations').doc(reservation).delete();
        this.firestore.collection('history').add(historyObject);
    }

    makeReservation(trip: Trip) {
        let oldReservation: Reservation;
        let userId: string = this.userId as string;
        oldReservation = this.reservations$.value.find((r: Reservation) => r.trip_id == trip.id)!;
        if (oldReservation) {
            this.firestore.collection('reservations').doc(oldReservation.reservation_id)
                .update({quantity: oldReservation.quantity + 1});
        } else {
            this.firestore.collection('reservations').add({
                client_id: userId,
                trip_id: trip.id,
                quantity: 1
            } as Reservation);
        }
        this.updateTrip(trip.id!, -1);
    }

    cancelReservation(trip: Trip) {
        let reservation = this.reservations$.value.find((r: Reservation) => r.trip_id == trip.id);
        if (!reservation || !trip)
            return
        if (reservation.quantity - 1 <= 0) {
            this.firestore.collection('reservations').doc(reservation.reservation_id).delete();
        } else {
            this.firestore.collection('reservations').doc(reservation.reservation_id)
                .update({quantity: reservation.quantity - 1});
        }
        this.updateTrip(trip.id!, +1);

    }

    getReservationByTrip(tripId: string): Reservation | undefined {
        return this.reservations$.value.filter((r: Reservation) => r.trip_id == tripId)[0];

    }

    private updateTrip(tripId: string, change: number) {
        let new_value = this.offersService.tripQuantity(tripId) + change;
        this.firestore.collection('offers').doc(tripId).update({quantity: new_value});
    }

}
