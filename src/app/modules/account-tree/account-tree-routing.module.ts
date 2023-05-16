import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountTreeComponent } from './account-tree.component';
import { AccountTreeEditComponent } from './components/account-tree-edit/account-tree-edit.component';
import { AccountTreeListComponent } from './components/account-tree-list/account-tree-list.component';

const routes: Routes = [
  
    {
      path: 'list', component: AccountTreeListComponent,
      data:
      {
        title: 'عرض شجرة الحسابات'
      }
    },
    {
      path: 'edit', component: AccountTreeEditComponent,
      data:
      {
        title: 'تعديل/إضافة شجرة الحسابات'
      }
    }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTreeRoutingModule { }
