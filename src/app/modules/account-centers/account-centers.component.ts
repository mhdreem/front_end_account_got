import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-account-centers',
  templateUrl: './account-centers.component.html',
  styleUrls: ['./account-centers.component.scss']
})
export class AccountCentersComponent {
  navItems: INavData[] = [

    {
      name: 'مركز الكلفة',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض مراكز الكلفة' ,
      url: 'accountCenters/module/accountCenters',
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
