import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BaseAPIService } from "./base/base-api.service";
import { UserService } from "./user.service";
import { payment_safe } from "../models/payment_safe";

@Injectable({
    providedIn: 'root'
  })
  export class PaymentSafeService extends BaseAPIService{
  
    public List_Payment_Safe:payment_safe[] = [];
  
    public List_Payment_Safe_BehaviorSubject:BehaviorSubject<payment_safe[]> = new BehaviorSubject<payment_safe[]>([]);
   
    constructor(protected override httpClient : HttpClient,
     ) { 
      super(httpClient)
  
      }
  
    list()  {
      return this.httpClient.get(this.RestUrl +"payment_safe/list",this.httpOptions) as Observable<payment_safe[]>;  
      
    }
  
  
    delete(id:number )  {
      return this.httpClient.delete(this.RestUrl +"payment_safe/delete/"+id,this.httpOptions);  
    }
  
    add(obj : payment_safe )  {
     
      return this.httpClient.post(this.RestUrl +"payment_safe/add",obj,this.httpOptions);  
    }
  
    update(obj : payment_safe )  {
      
      return this.httpClient.put(this.RestUrl +"payment_safe/update",obj,this.httpOptions);  
    }
  
    search(req : any )  {
      return this.httpClient.post(this.RestUrl +"payment_safe/Search",req,this.httpOptions);  
    }
  
    getById(id: number){
      return this.httpClient.get(this.RestUrl +"payment_safe/GetByID/"+id,this.httpOptions) as Observable<payment_safe>;  
      
    }
  
    getBySeq(seq: number){
      return this.httpClient.get(this.RestUrl +"payment_safe/GetBySeq/"+seq,this.httpOptions) as Observable<payment_safe>;        
    }

    orderRow(req : any[] )  {
        return this.httpClient.post(this.RestUrl +"payment_safe/OrderRow",req,this.httpOptions);  
      }

      validate_name(obj: payment_safe) {
        return this.httpClient.post(this.RestUrl + "payment_safe/Validate_Name", obj, this.httpOptions);
      }
    
  }
  