import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {Trip} from "../models/trip";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OffersService {
    private allTrips$ = new BehaviorSubject<Trip[]>([]);

    constructor(private router: Router, private firestore: AngularFirestore) {
        firestore.collection('offers')
            .snapshotChanges()
            .subscribe((data) => this.parseAllOffers(data)
            );
    }

    public allTrips() {
        return this.allTrips$.asObservable();
    }

    public tripQuantity(tripId: String) {
        return this.allTrips$.value.find(value => value.id === tripId)!.quantity;
    }

    delete(payload: Trip) {
        console.log("delete me:", payload)
        console.log(payload.id);
        if (payload.id?.length) {
            this.firestore.collection("offers").doc(payload.id as string).delete()
                .then(() => console.log("Trip " + payload.name + " deleted."))
        }
    }

    addOffer(payload: Trip) {
        this.firestore.collection('offers').add(payload);
    }

    private parseAllOffers(firebaseMetadata: DocumentChangeAction<unknown>[]) {
        let newLocalOffers: Trip[] = [];
        for (let item of firebaseMetadata) {
            let object: any = item.payload.doc.data();
            object.id = item.payload.doc.id;
            newLocalOffers.push(object as Trip)
        }
        this.allTrips$.next(newLocalOffers);
    }

}
