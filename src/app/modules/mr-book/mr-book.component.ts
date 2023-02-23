import { Component } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-mr-book',
  templateUrl: './mr-book.component.html',
  styleUrls: ['./mr-book.component.scss']
})
export class MrBookComponent {
  navItems: INavData[] = [

    {
      name: 'دفتر الأستاذ',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'عرض دفتر الأستاذ' ,
      url: 'mrBook/module/mrBook',
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
