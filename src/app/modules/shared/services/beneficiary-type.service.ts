import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BeneficiaryType } from '../models/beneficiary-type';
import { HttpClient, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import { BaseAPIService } from './base/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryTypeService extends BaseAPIService {

  public List_beneficiary_type:BeneficiaryType[] = [];

  public List_beneficiary_type_BehaviorSubject:BehaviorSubject<BeneficiaryType[]> = new BehaviorSubject<BeneficiaryType[]>([]);



  constructor(protected override httpClient: HttpClient) {
    super(httpClient)
  }

  list() :Observable<BeneficiaryType[]> {
      return this.httpClient.get<BeneficiaryType[]>(this.RestUrl +"Beneficiary_Type/list",this.httpOptions) ;  
    
  }


  fill()  {

    this.Subscription.add(
      this.httpClient.get<BeneficiaryType[]>(this.RestUrl +"Beneficiary_Type/list",this.httpOptions) .subscribe    (
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

  add(obj : BeneficiaryType )  {
     return this.httpClient.post(this.RestUrl +"Beneficiary_Type/add",obj,this.httpOptions);  
  }

  update(obj : BeneficiaryType )  {
      return this.httpClient.put(this.RestUrl +"Beneficiary_Type/update",obj,this.httpOptions);  
  }

  validate_name(obj: BeneficiaryType) {
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
