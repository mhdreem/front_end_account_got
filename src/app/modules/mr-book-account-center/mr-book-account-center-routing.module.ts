import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MrBookAccountCenterListComponent } from './components/mr-book-account-center-list/mr-book-account-center-list.component';
import { MrBookAccountCenterComponent } from './mr-book-account-center.component';

const routes: Routes = [
        {
          path: 'list', component: MrBookAccountCenterListComponent,
          data:
          {
            title: 'عرض دفتر الأستاذ مركز الكلفة'
          }
        },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrBookAccountCenterRoutingModule { }
