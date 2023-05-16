import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

import { ExchangeOrderRoutingModule } from './exchange-order-routing.module';
import { ExchangeOrderComponent } from './exchange-order.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ExchangeOrderListComponent} from './components/exchange-order-list/exchange-order-list.component'
import {ExchangeOrderEditComponent} from './components/exchange-order-edit/exchange-order-edit.component'
import {ExchangeOrderDetailComponent} from './components/exchange-order-detail/exchange-order-detail.component'
import {ExchangeOrderAttachmentsComponent} from './components/exchange-order-attachments/exchange-order-attachments.component'
import {MatExpansionModule} from '@angular/material/expansion';
import { BreadcrumbModule, GridModule, NavModule, TabsModule } from '@coreui/angular';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModuleModule} from '../common-module/common-module.module'
import { CardModule } from '@coreui/angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExchangeOrderSearchBarComponent } from './components/exchange-order-search-bar/exchange-order-search-bar.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { OffcanvasModule } from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExchangeOrderListSearchComponent } from './components/exchange-order-list-search/exchange-order-list-search.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewsModule } from '../views/views.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ExchangeOrderEntryComponent } from './components/exchange-order-entry/exchange-order-entry.component';
import { ExchangeOrderPrintRowsComponent } from './components/exchange-order-print-rows/exchange-order-print-rows.component';
import { ExchangeOrderPrintComponent } from './components/exchange-order-print/exchange-order-print.component';
import {MatTabsModule} from '@angular/material/tabs'; 
const Import_Corui = [
  GridModule,
  CardModule,
  NavModule, 
  TabsModule
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};



@NgModule({
  declarations: [
    ExchangeOrderComponent,
    ExchangeOrderListComponent,
    ExchangeOrderEditComponent,
    ExchangeOrderDetailComponent,
    ExchangeOrderAttachmentsComponent,
    ExchangeOrderSearchBarComponent,
    ExchangeOrderListSearchComponent,
    ExchangeOrderEntryComponent,ExchangeOrderPrintRowsComponent,
    ExchangeOrderPrintComponent
    ],
  imports: [
    CommonModule,
    ViewsModule,
    ExchangeOrderRoutingModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    NgbDatepickerModule,
    JsonPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatMenuModule,
    Import_Corui,
    CommonModuleModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgbModule ,    
    FontAwesomeModule,
    IconModule,
   PerfectScrollbarModule,
   MatTabsModule
    
  ],providers:[
   
    IconSetService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ExchangeOrderModule { }
