import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExchangeOrder } from '../models/exchange-order';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOrderService {

  public List_ExchangeOrder:ExchangeOrder[] = [];

  public List_ExchangeOrder_BehaviorSubject:BehaviorSubject<ExchangeOrder[]> = new BehaviorSubject<ExchangeOrder[]>([]);



  private RestUrl = 'https://localhost:7137/api/';
  // private RestUrl = 'http://localhost:8083/api/';
  private httpOptions = { 
    headers: new HttpHeaders( { 'Content-Type': 'application/json;charset=UTF-8' }) 
 };
 
  constructor(private httpClient : HttpClient) { }

  list()  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Sanad_Kid/list",options) as Observable<ExchangeOrder[]>;  
    
  }


  delete(id:number )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };
    return this.httpClient.delete(this.RestUrl +"Exchange_Order/delete/"+id,options);  
  }

  add(obj : ExchangeOrder )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions= { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.post(this.RestUrl +"Exchange_Order/add",obj,options);  
  }

  update(obj : ExchangeOrder )  {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const httpParams: HttpParamsOptions = { 'obj': obj } as HttpParamsOptions;
  
    const options = {  headers: headers };
    return this.httpClient.put(this.RestUrl +"Exchange_Order/update",obj,options);  
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
    return this.httpClient.get(this.RestUrl +"Exchange_Order/GetByID/"+id,options) as Observable<ExchangeOrder>;  
    
  }

  getBySeq(seq: number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {  headers: headers };  
    return this.httpClient.get(this.RestUrl +"Exchange_Order/GetBySeq/"+seq,options) as Observable<ExchangeOrder>;  
    
  }
}
