import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { operation_type } from "../models/operation_type";
import { BaseAPIService } from "./base/base-api.service";

@Injectable({
    providedIn: 'root'
  })

  export class OperationTypeService extends BaseAPIService{
  
    public List_operation_type:operation_type[] = [];
  
    public List_operation_type_BehaviorSubject:BehaviorSubject<operation_type[]> = new BehaviorSubject<operation_type[]>([]);
   
    constructor(protected override httpClient : HttpClient,
     ) { 
      super(httpClient)
  
      }
  
    list()  {
      return this.httpClient.get(this.RestUrl +"Operation_Type/list",this.httpOptions) as Observable<operation_type[]>;  
      
    }
  
  
  
    
  }
  