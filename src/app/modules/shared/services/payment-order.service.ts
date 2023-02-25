import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { payment_order } from '../models/payment_order';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentOrderService {

  public List_PaymentOrder:payment_order[] = [];

  public List_PaymentOrder_BehaviorSubject:BehaviorSubject<payment_order[]> = new BehaviorSubject<payment_order[]>([]);



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
    return this.httpClient.get(this.RestUrl +"Payment_Order/list",options) as Observable<payment_order[]>;  
    
  }


  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"Payment_Order/delete/"+id,options);  
  }

  add(obj : payment_order )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.post(this.RestUrl +"Payment_Order/add/"+user_fk,obj,options);  
  }

  update(obj : payment_order )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    let user_fk= this.userService.Login_User;
    return this.httpClient.put(this.RestUrl +"Payment_Order/update/"+user_fk,obj,options);  
  }

  search(req : any )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': req } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"Payment_Order/Search",req,options);  
  }

  getById(id: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Payment_Order/GetByID/"+id,options) as Observable<payment_order>;  
    
  }

  getBySeq(seq: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Payment_Order/GetBySeq/"+seq,options) as Observable<payment_order>;  
    
  }
}
