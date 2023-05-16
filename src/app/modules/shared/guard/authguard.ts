import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { user } from '../models/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private UserService:UserService
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('isLoggedin')) {
        if (localStorage.getItem('User')) {
   //     this.UserService.Login_User =localStorage.getItem('User') as user;

        if (this.UserService.Login_User != null &&
            this.UserService.Login_User.user_seq!= null  &&
            this.UserService.Login_User.user_seq>0
            )
            // logged in so return true
            return true;
    }
}

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}