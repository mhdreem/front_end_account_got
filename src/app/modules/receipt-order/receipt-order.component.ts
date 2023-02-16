import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-receipt-order',
  templateUrl: './receipt-order.component.html',
  styleUrls: ['./receipt-order.component.scss']
})
export class ReceiptOrderComponent {
  navItems: INavData[] = [

    {
      name: 'أمر القبض',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض أوامر القبض' ,
      url: 'receiptOrder/module/receiptOrder',
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
