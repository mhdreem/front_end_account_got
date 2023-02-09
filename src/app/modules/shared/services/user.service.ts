import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { user } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public List_User:user[] = [];

  public List_User_BehaviorSubject:BehaviorSubject<user[]> = new BehaviorSubject<user[]>([]);



  private RestUrl = 'https://localhost:7137/api/';
  // private RestUrl = 'http://localhost:8083/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"User/list",options) as Observable<user[]>;  
    
  }


  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<user[]>(this.RestUrl +"User/list",options) .subscribe    (
      data=>
      {
        this.List_User = data;
        this.List_User_BehaviorSubject.next(this.List_User);
      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"User/delete/"+id,options);  
  }

  add(obj : user )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"User/add",obj,options);  
  }

  update(obj : user )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"User/update",obj,options);  
  }

  validate_name(obj : user){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"User/Validate_Name",obj,options);
  }
}
