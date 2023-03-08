import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-review-balance',
  templateUrl: './review-balance.component.html',
  styleUrls: ['./review-balance.component.scss']
})
export class ReviewBalanceComponent {
  navItems: INavData[] = [

    {
      name: 'ميزان المراجعة',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض ميزان المراجعة' ,
      url: 'reviewBalance/module/reviewBalance',
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
