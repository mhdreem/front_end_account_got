import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { sanad_kid_detail } from '../../../shared/models/sanad_kid_detail';
import { exchange_order_detail } from '../../../shared/models/exchange_order_detail';
import { payment_order_detail } from '../../../shared/models/payment_order_detail';
import { receipt_order_detail } from '../../../shared/models/receipt_order_detail';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css']
})
export class DocumentInfoComponent implements OnInit,OnChanges {

  

  _type:string ='';

  @Input() set  type(obj:string)
  {
    this._type = obj;
  }
  get type():string
  {
    return this._type;
  }

  _data:any ;
  @Input() set data(obj:any)
  {
    this._data = obj;
  }
  get data(): any
  {
      return this._data;
  }

  ngOnInit(): void {  
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']!= null )
    {
      this.data = changes['data'].currentValue;

    }
    if (changes['type']!= null )
    {
      this.type = changes['type'] .currentValue;
    }
    
    
  }




  total_sanad_credit()
  {
    if (this.data != null && this.data.sanad_kid_details!= null)
    {
      let sanad_kid_details : sanad_kid_detail[] = this.data.sanad_kid_details as sanad_kid_detail[];
      if (sanad_kid_details!= null && sanad_kid_details.length>0)
      {
        let sum: number = 0;
        sanad_kid_details.forEach(element => {
          if (element.creditor != null) sum = sum + (+element.creditor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

  total_sanad_debt()
  {
    if (this.data != null && this.data.sanad_kid_details!= null)
    {
      let sanad_kid_details : sanad_kid_detail[] = this.data.sanad_kid_details as sanad_kid_detail[];
      if (sanad_kid_details!= null && sanad_kid_details.length>0)
      {
        let sum: number = 0;
        sanad_kid_details.forEach(element => {
          if (element.debtor != null) sum = sum + (+element.debtor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

  ///////////////////////
  

  total_exchange_order_credit()
  {
    if (this.data != null && this.data.exchange_order_details!= null)
    {
      let exchange_order_details : exchange_order_detail[] = this.data.exchange_order_details as exchange_order_detail[];
      if (exchange_order_details!= null && exchange_order_details.length>0)
      {
        let sum: number = 0;
        exchange_order_details.forEach(element => {
          if (element.creditor != null) sum = sum + (+element.creditor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

  total_exchange_order_debt()
  {
    if (this.data != null && this.data.exchange_order_details!= null)
    {
      let exchange_order_details : exchange_order_detail[] = this.data.exchange_order_details as exchange_order_detail[];
      if (exchange_order_details!= null && exchange_order_details.length>0)
      {
        let sum: number = 0;
        exchange_order_details.forEach(element => {
          if (element.debtor != null) sum = sum + (+element.debtor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }
  ///////////////////////////////////////////
  

  total_payment_order_credit()
  {
    if (this.data != null && this.data.payment_order_details!= null)
    {
      let payment_order_details : payment_order_detail[] = this.data.sanad_kid_details as payment_order_detail[];
      if (payment_order_details!= null && payment_order_details.length>0)
      {
        let sum: number = 0;
        payment_order_details.forEach(element => {
          if (element.creditor != null) sum = sum + (+element.creditor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

  total_payment_order_debt()
  {
    if (this.data != null && this.data.payment_order_details!= null)
    {
      let payment_order_details : payment_order_detail[] = this.data.sanad_kid_details as payment_order_detail[];
      if (payment_order_details!= null && payment_order_details.length>0)
      {
        let sum: number = 0;
        payment_order_details.forEach(element => {
          if (element.debtor != null) sum = sum + (+element.debtor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }
  /////

total_receipt_order_credit()
  {
    if (this.data != null && this.data.receipt_order_details!= null)
    {
      let receipt_order_details : receipt_order_detail[] = this.data.receipt_order_details as receipt_order_detail[];
      if (receipt_order_details!= null && receipt_order_details.length>0)
      {
        let sum: number = 0;
        receipt_order_details.forEach(element => {
          if (element.creditor != null) sum = sum + (+element.creditor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

  total_receipt_order_debt()
  {
    if (this.data != null && this.data.receipt_order_details!= null)
    {
      let receipt_order_details : receipt_order_detail[] = this.data.receipt_order_details as receipt_order_detail[];
      if (receipt_order_details!= null && receipt_order_details.length>0)
      {
        let sum: number = 0;
        receipt_order_details.forEach(element => {
          if (element.debtor != null) sum = sum + (+element.debtor);
        });
  
       
        return sum;
      }

    }
    return 0;
  }

}
