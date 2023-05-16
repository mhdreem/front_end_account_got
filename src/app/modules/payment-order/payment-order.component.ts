import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';

@Component({
  selector: 'app-payment-order',
  templateUrl: './payment-order.component.html',
  styleUrls: ['./payment-order.component.scss']
})
export class PaymentOrderComponent implements OnInit {
  navItems: INavData[] = [

    {
      name: 'أمر الدفع',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض أوامر الدفع' ,
      url: 'paymentOrder/module/paymentOrder',
      iconComponent: { name: 'cil-pencil' },
  
    },
   
  ];

  constructor(private navService:NavService){
    this.navService.navItems_Subject.next(this.navItems);

  }

  ngOnInit(): void {
    this.navService.navItems_Subject.next(this.navItems);
  
    }
}
