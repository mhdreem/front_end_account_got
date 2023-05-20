import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { beneficiary_type } from '../models/beneficiary-type';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryTypeService extends BaseAPIService {

  public List_beneficiary_type:beneficiary_type[] = [];

  public List_beneficiary_type_BehaviorSubject:BehaviorSubject<beneficiary_type[]> = new BehaviorSubject<beneficiary_type[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list() :Observable<beneficiary_type[]> {
      return this.httpClient.get<beneficiary_type[]>(this.RestUrl +"Beneficiary_Type/list",this.httpOptions) ;  
    
  }


  fill()  {

    this.Subscription.add(
      this.httpClient.get<beneficiary_type[]>(this.RestUrl +"Beneficiary_Type/list",this.httpOptions) .subscribe    (
        data=>
        {
          this.List_beneficiary_type = data;
          this.List_beneficiary_type_BehaviorSubject.next(this.List_beneficiary_type);
        }
       )
    );
        
    
  }

  delete(id:number )  {
     return this.httpClient.delete(this.RestUrl +"Beneficiary_Type/delete/"+id,this.httpOptions);  
  }

  add(obj : beneficiary_type )  {
     return this.httpClient.post(this.RestUrl +"Beneficiary_Type/add",obj,this.httpOptions);  
  }

  update(obj : beneficiary_type )  {
      return this.httpClient.put(this.RestUrl +"Beneficiary_Type/update",obj,this.httpOptions);  
  }

  validate_name(obj: beneficiary_type) {
    console.log('111');
    return this.httpClient.post(this.RestUrl + "Beneficiary_Type/Validate_Name", obj, this.httpOptions);
  }


  orderRow(req: any[]) {
    return this.httpClient.post(this.RestUrl + "Beneficiary_Type/OrderRow", req);
  }


  
  importExcel(formData: FormData) {
    return this.httpClient.post(this.RestUrl + "Beneficiary_Type/importExcel",formData);
  }
}
