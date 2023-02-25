import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { exchange_order } from '../models/exchange_order';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOrderService {

  public List_ExchangeOrder:exchange_order[] = [];

  public List_ExchangeOrder_BehaviorSubject:BehaviorSubject<exchange_order[]> = new BehaviorSubject<exchange_order[]>([]);



  private RestUrl = 'https://localhost:7137/api/';
  // private RestUrl = 'http://localhost:8083/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient,
    private userService :UserService ) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Exchange_Order/list",options) as Observable<exchange_order[]>;  
    
  }


  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"Exchange_Order/delete/"+id,options);  
  }

  add(obj : exchange_order )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.post(this.RestUrl +"Exchange_Order/add/"+user_fk,obj,options);  
  }

  update(obj : exchange_order )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.put(this.RestUrl +"Exchange_Order/update/"+user_fk,obj,options);  
  }

  search(req : any )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': req } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"Exchange_Order/Search",req,options);  
  }

  getById(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Exchange_Order/GetByID/"+id,options) as Observable<exchange_order>;  
    
  }

  getBySeq(seq: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Exchange_Order/GetBySeq/"+seq,options) as Observable<exchange_order>;  
    
  }
}
