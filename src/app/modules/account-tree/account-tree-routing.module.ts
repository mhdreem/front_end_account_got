import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountTreeComponent } from './account-tree.component';
import { AccountTreeListComponent } from './components/account-tree-list/account-tree-list.component';

const routes: Routes = [
  { path: 'module',
  component: AccountTreeComponent,
  data:
      {
        title: 'شجرة الحسابات'
      },
  children:
  [
    {
      path: 'accountTree', component: AccountTreeListComponent,
      data:
      {
        title: 'شجرة الحسابات'
      }
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTreeRoutingModule { }
