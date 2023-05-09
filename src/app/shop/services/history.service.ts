import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {History} from "../models/history";
import {UserService} from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private user$;
    private allHistory$ = new BehaviorSubject<History[]>([]);
    private userHistory$: Observable<History[]> = new BehaviorSubject<History[]>([]);


    constructor(private userService: UserService, private firestore: AngularFirestore,) {
        firestore.collection('history')
            .snapshotChanges()
            .subscribe((firebaseMetadata) => {
                    let newLocalOffers: History[] = [];
                    for (let item of firebaseMetadata) {
                        let object: any = item.payload.doc.data();
                        object = object as History;
                        newLocalOffers.push(object)
                    }
                    this.allHistory$.next(newLocalOffers);
                }
            );


        this.user$ = userService.getUser();


        this.userHistory$ = combineLatest([this.user$, this.allHistory$]).pipe(
            map(
                ([new_user, new_history]) => {
                    if (!new_user)
                        return [] as History[];
                    else
                        return [...this.allHistory$.value.filter((h) => h.clientUID === new_user.user_id)]
                }
            )
        );
    }

    userHistory(): Observable<History[]> {
        return this.userHistory$;
    }
}
