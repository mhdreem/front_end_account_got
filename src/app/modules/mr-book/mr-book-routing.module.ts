import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MrBookListComponent } from './components/mr-book-list/mr-book-list.component';
import { MrBookComponent } from './mr-book.component';

const routes: Routes = [
  {
    path: 'module',
    component: MrBookComponent,
    data:
      {
        title: 'دفتر الأستاذ'
      },
      children:[
        {
          path: 'mrBook', component: MrBookListComponent,
          data:
          {
            title: 'عرض دفتر الأستاذ'
          }
        },
        // {
        //   path: 'exchangeOrderEdit', component: ExchangeOrderEditComponent,
        //   data:
        //   {
        //     title: 'تعديل أمر الصرف'
        //   }
        // },
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrBookRoutingModule { }
