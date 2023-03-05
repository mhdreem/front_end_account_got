import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { GridModule } from '@coreui/angular';
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

const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    ExchangeOrderComponent,
    ExchangeOrderListComponent,
    ExchangeOrderEditComponent,
    ExchangeOrderDetailComponent,
    ExchangeOrderAttachmentsComponent,
    ExchangeOrderSearchBarComponent,
    ],
  imports: [
    CommonModule,
    ExchangeOrderRoutingModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatMenuModule,
    Import_Corui,
    CommonModuleModule,
    MatProgressBarModule,
    InfiniteScrollModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule
    
  ],
})
export class ExchangeOrderModule { }
