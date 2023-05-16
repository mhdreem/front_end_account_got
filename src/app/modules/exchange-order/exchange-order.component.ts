import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from 'src/app/coreui/icons/icon-subset';

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
    private returnBtnService: ReturnBtnService,
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService) {
    
      // iconSet singleton
      iconSetService.icons = { ...iconSubset };

     }
    
    ngOnInit(): void {
  
    }
}
