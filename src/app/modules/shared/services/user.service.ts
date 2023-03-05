import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { user } from '../models/user';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseAPIService{

  Login_User :user ;
  Login_User_BehavourSubject: BehaviorSubject<user> = new BehaviorSubject<user>({});

  public List_User:user[] = [];
  public List_User_BehaviorSubject:BehaviorSubject<user[]> = new BehaviorSubject<user[]>([]);

  constructor(protected override httpClient : HttpClient) { 
    super(httpClient)
  }

  list()  {
    return this.httpClient.get(this.RestUrl +"User/list",this.httpOptions) as Observable<user[]>;  
    
  }


  fill()  {
     this.httpClient.get<user[]>(this.RestUrl +"User/list",this.httpOptions) .subscribe    (
      data=>
      {
        this.List_User = data;
        this.List_User_BehaviorSubject.next(this.List_User);
      }
     )
    
  }

  delete(id:number )  {
    return this.httpClient.delete(this.RestUrl +"User/delete/"+id,this.httpOptions);  
  }

  add(obj : user )  {
    return this.httpClient.post(this.RestUrl +"User/add",obj,this.httpOptions);  
  }

  update(obj : user )  {
    return this.httpClient.put(this.RestUrl +"User/update",obj,this.httpOptions);  
  }

  validate_name(obj : user){
    return this.httpClient.post(this.RestUrl +"User/Validate_Name",obj,this.httpOptions);
  }

  login(obj :  user )
  {
    return this.httpClient.post(this.RestUrl +"User/Login/",obj ,this.httpOptions);       
  }
}
