import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { sanad_kid } from '../models/sanad-kid';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SanadKidService {

  public List_SanadKid:sanad_kid[] = [];

  public List_SanadKid_BehaviorSubject:BehaviorSubject<sanad_kid[]> = new BehaviorSubject<sanad_kid[]>([]);



  private RestUrl = 'https://localhost:7137/api/';
  // private RestUrl = 'http://localhost:8083/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient,
    private userService :UserService) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/list",options) as Observable<sanad_kid[]>;  
    
  }


  fill()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
     this.httpClient.get<sanad_kid[]>(this.RestUrl +"Sanad_Kid/list",options) .subscribe    (
      data=>
      {
        this.List_SanadKid = data;
        this.List_SanadKid_BehaviorSubject.next(this.List_SanadKid);
      }
     )
    
  }

  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"Sanad_Kid/delete/"+id,options);  
  }

  add(obj : sanad_kid )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.post(this.RestUrl +"Sanad_Kid/add/"+user_fk,obj,options);  
  }

  update(obj : sanad_kid )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.put(this.RestUrl +"Sanad_Kid/update/"+user_fk,obj,options);  
  }

  search(req : any )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': req } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"Sanad_Kid/Search",req,options);  
  }

  getById(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/GetByID/"+id,options) as Observable<sanad_kid>;  
    
  }

  getBySeq(seq: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/GetBySeq/"+seq,options) as Observable<sanad_kid>;  
    
  }
}
