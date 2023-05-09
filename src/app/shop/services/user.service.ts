import {Injectable} from '@angular/core';
import firebase from "firebase/compat";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject, take} from "rxjs";
import {UserState} from "../models/userState";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserStateServer} from "../models/userStateServer";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$ = new BehaviorSubject<null | UserState>(null);

  private allUsers$ = new BehaviorSubject<null | UserState[]>(null);

  constructor(private angularFireAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {

    angularFireAuth.authState.subscribe((fireAuthUser: firebase.User | null) => {
      if (fireAuthUser) {
        console.warn("USER LOADED")
        this.updateUserData(fireAuthUser.uid, fireAuthUser.email as string);
      } else {
        console.warn("USER NOT FOUND")
        this.user$.next(null);
      }
    });
  }

  public getUser() {
    return this.user$.asObservable();
  }

  login(email: string, password: string) {
    this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string, username: string) {
    this.angularFireAuth.createUserWithEmailAndPassword(email, password).catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    }).then(() => this.initUserInDb(email, username)).then(() => this.login(email, password));
  }

  private initUserInDb(email: string, username: string) {
    this.firestore.collection("users").doc(email).set({
      username: username,
      banned: false,
      rank: [0]
    } as UserStateServer)
  }

  signOut() {
    this.angularFireAuth.signOut().then(r => console.log(r));
    this.router.navigate(['home']);
  }

  getUserData() {
    return this.user$.asObservable();
  }


  updateUserData(UID: string, email: string) {
    console.log("UPDATE STANU KLIENTA")
    let serverData: UserStateServer | undefined;
    this.firestore.doc(`users/${email}`).valueChanges().pipe(take(1)).subscribe((data) => {
      serverData = data as UserStateServer;
      console.log("userServerData", serverData)
      let tempData: UserState = {
        user_id: UID,
        username: serverData.username,
        banned: serverData.banned,
        rank: serverData.rank
      };
      console.log("userNewState", tempData)
      this.user$.next(tempData)
    })
  }


  getAllUsers() {
    return this.allUsers$.asObservable();
  }

  toggleUserBan(user: UserState) {
    console.log(user.user_id)
    if (user.user_id)
      this.firestore.collection('users').doc(user.user_id).update({banned: !user.banned});
  }

  toggleUserPermission(user: UserState, permissionId: number) {
    let newPermissionList: number[];
    if (user.rank.includes(permissionId))
      newPermissionList = user.rank.filter((r: number) => r != permissionId);
    else
      newPermissionList = [...user.rank, permissionId]
    this.firestore.collection('users').doc(user.user_id).update({rank: newPermissionList});
  }

  requestUserList() {
    if (this.allUsers$.getValue() == null) {
      this.firestore.collection('users').snapshotChanges().subscribe((newData) => {
        let allUsers: UserState[] = [];
        for (let item of newData) {
          let object: any = item.payload.doc.data();
          object.userDbId = item.payload.doc.id;
          allUsers.push(object as UserState);
        }
        this.allUsers$.next(allUsers);
      });
    }
  }
}
