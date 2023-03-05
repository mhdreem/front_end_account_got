import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../shared/services/return-btn.service';

@Component({
  selector: 'app-account',
  templateUrl: './coding-tables.component.html',
  styleUrls: ['./coding-tables.component.scss']
})
export class CodingTablesComponent implements OnInit {

  navItems: INavData[] = [

    {
      name: 'جداول التراميز',
      url: '/',
      // iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'مركز الكلفة' ,
      url: 'codingTable/module/accountCenter',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'الفرع' ,
      url: 'codingTable/module/branch',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'القسم' ,
      url: 'codingTable/module/department',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'المستخدم' ,
      url: 'codingTable/module/user',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'القائمة المالية' ,
      url: 'codingTable/module/finanaceList',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'تصنيف الحساب' ,
      url: 'codingTable/module/class',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'الحساب الختامي' ,
      url: 'codingTable/module/accountFinal',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مجموعة الحسابات' ,
      url: 'codingTable/module/group',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مستوى الحساب' ,
      url: 'codingTable/module/level',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'نوع الحساب' ,
      url: 'codingTable/module/type',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة سند القيد' ,
      url: 'codingTable/module/sanadKidStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر الصرف' ,
      url: 'codingTable/module/exchangeOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر الدفع' ,
      url: 'codingTable/module/paymentOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'مرحلة أمر القبض' ,
      url: 'codingTable/module/receiptOrderStage',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'نوع المرفق' ,
      url: 'codingTable/module/attachmentType',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'دفتر سند القيد' ,
      url: 'codingTable/module/sanadKidBook',
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
