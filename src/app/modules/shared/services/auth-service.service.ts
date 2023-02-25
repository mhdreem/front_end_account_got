import { Injectable } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { user} from '../models/user';
import { UserService } from './user.service';
import { Inject } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})


export class AuthServiceService {
  constructor(@Inject(JwtHelperService) public jwtHelper: JwtHelperService,
    private userService:UserService) {}  // ...

  public isAuthenticated(): boolean { 

    if (this.userService!= null &&
      (this.userService.Login_User== null || 
       this.userService.Login_User.user_seq == null 
      )
      )
      return false;


      if (localStorage.getItem('User')== null )        
        return false;

      
    let token:string ;
  
     token = localStorage.getItem('token') || '';    // Check whether the token is expired and return
    
    
    return !this.jwtHelper.isTokenExpired(token);
  }
}
