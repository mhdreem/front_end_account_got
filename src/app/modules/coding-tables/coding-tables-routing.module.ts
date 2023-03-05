  import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodingTablesComponent } from './coding-tables.component';
import { AccountCenterListComponent } from './components/account-center/account-center-list/account-center-list.component';
import { AccountClassListComponent } from './components/account-class/account-class-list/account-class-list.component';
import { AccountFinalListComponent } from './components/account-final/account-final-list/account-final-list.component';
import { AccountGroupListComponent } from './components/account-group/account-group-list/account-group-list.component';
import { AccountLevelListComponent } from './components/account-level/account-level-list/account-level-list.component';
import { AccountTypeListComponent } from './components/account-type/account-type-list/account-type-list.component';
import { AttachmentTypeListComponent } from './components/attachment-type/attachment-type-list/attachment-type-list.component';
import { BranchListComponent } from './components/branch/branch-list/branch-list.component';
import { DepartmentListComponent } from './components/department/department-list/department-list.component';
import { ExchangeOrderStageListComponent } from './components/exchange-order-stage/exchange-order-stage-list/exchange-order-stage-list.component';
import { FinanceListListComponent } from './components/finance-list/finance-list-list/finance-list-list.component';
import { PaymentOrderStageListComponent } from './components/payment-order-stage/payment-order-stage-list/payment-order-stage-list.component';
import { ReceiptOrderStageListComponent } from './components/receipt-order-stage/receipt-order-stage-list/receipt-order-stage-list.component';
import { SanadKidBookAddComponent } from './components/sanad-kid-book/sanad-kid-book-add/sanad-kid-book-add.component';
import { SanadKidBookListComponent } from './components/sanad-kid-book/sanad-kid-book-list/sanad-kid-book-list.component';
import { SanadKidStageListComponent } from './components/sanad-kid-stage/sanad-kid-stage-list/sanad-kid-stage-list.component';
import { UserListComponent } from './components/user/user-list/user-list.component';

const routes: Routes = [
  {
    path: 'module',
    component: CodingTablesComponent,
    data:
      {
        title: 'جداول الترميز'
      },
      children:[
        {
          path: 'accountCenter', component: AccountCenterListComponent,
          data:
          {
            title: 'مركز الكلفة'
          }
        },
        { 
          path: 'branch', component: BranchListComponent,
          data:
          {
            title: 'الفرع'
          }
        },
        { 
          path: 'department', component: DepartmentListComponent,
          data:
          {
            title: 'القسم'
          }
        },
        { 
          path: 'user', component: UserListComponent,
          data:
          {
            title: 'المستخدم'
          }
        },
        { 
          path: 'finanaceList', component: FinanceListListComponent,
          data:
          {
            title: 'القائمة المالية'
          }
        },
        { 
          path: 'class', component: AccountClassListComponent,
          data:
          {
            title: 'صنف الحساب'
          }
        },
        { 
          path: 'accountFinal', component: AccountFinalListComponent,
          data:
          {
            title: 'الحساب النهائي'
          }
        },
        { 
          path: 'group', component: AccountGroupListComponent,
          data:
          {
            title: 'مجموعة الحساب'
          }
        },
        { 
          path: 'level', component: AccountLevelListComponent,
          data:
          {
            title: 'مستوى الحساب'
          }
        },
        { 
          path: 'type', component: AccountTypeListComponent,
          data:
          {
            title: 'نوع الحساب'
          }
        },
        { 
          path: 'sanadKidStage', component: SanadKidStageListComponent,
          data:
          {
            title: 'مرحلة سند القيد'
          }
        },
        { 
          path: 'exchangeOrderStage', component: ExchangeOrderStageListComponent,
          data:
          {
            title: 'مرحلة أمر الصرف'
          }
        },
        { 
          path: 'paymentOrderStage', component: PaymentOrderStageListComponent,
          data:
          {
            title: 'مرحلة أمر الدفع'
          }
        },
        { 
          path: 'receiptOrderStage', component: ReceiptOrderStageListComponent,
          data:
          {
            title: 'مرحلة أمر القبض'
          }
        },
        { 
          path: 'attachmentType', component: AttachmentTypeListComponent,
          data:
          {
            title: 'نوع المرفق'
          }
        },
        { 
          path: 'sanadKidBook', component: SanadKidBookListComponent,
          data:
          {
            title: 'دفتر سند القيد'
          }
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodingTablesRoutingModule { }
