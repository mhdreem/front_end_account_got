import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-exchange-order',
  templateUrl: './exchange-order.component.html',
  styleUrls: ['./exchange-order.component.scss']
})
export class ExchangeOrderComponent {

  navItems: INavData[] = [

    {
      name: 'أمر الصرف',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض أوامر الصرف' ,
      url: 'exchangeOrder/module/exchangeOrder',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
  ];

  constructor(private navService:NavService,
    private returnBtnService: ReturnBtnService) {
  
      this.navService.navItems_Subject.next(this.navItems);
      // this.returnBtnService.navItems= this.returnNavItems;
    }
  
    ngOnInit(): void {
    this.navService.navItems_Subject.next(this.navItems);
  
    }
}
