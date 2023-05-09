import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})

export class ValidAccount implements CanActivate {
  private isLogged: boolean = false;

  constructor(public router: Router, private userService: UserService) {
    userService.getUserData().subscribe((d)=> this.isLogged = !!d)
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLogged;
  }
}
