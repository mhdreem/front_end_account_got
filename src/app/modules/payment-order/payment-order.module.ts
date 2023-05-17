import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentOrderRoutingModule } from './payment-order-routing.module';
import { PaymentOrderComponent } from './payment-order.component';
import { PaymentOrderListComponent } from './components/payment-order-list/payment-order-list.component';
import { PaymentOrderEditComponent } from './components/payment-order-edit/payment-order-edit.component';
import { PaymentOrderDetailsComponent } from './components/payment-order-details/payment-order-details.component';
import { PaymentOrderAttachmentsComponent } from './components/payment-order-attachments/payment-order-attachments.component';

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

import {MatExpansionModule} from '@angular/material/expansion';
import { GridModule } from '@coreui/angular';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModuleModule} from '../common-module/common-module.module'
import { CardModule } from '@coreui/angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {PaymentOrderSearchBarComponent} from './components/payment-order-search-bar/payment-order-search-bar.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewsModule } from '../views/views.module';
import { PaymentOrderListSearchComponent } from './components/payment-order-list-search/payment-order-list-search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentOrderEntryComponent } from './components/payment-order-entry/payment-order-entry.component';
import { PaymentOrderPrintRowsComponent } from './components/payment-order-print-rows/payment-order-print-rows.component';
import { PaymentOrderPrintComponent } from './components/payment-order-print/payment-order-print.component';

const Import_Corui = [
  GridModule,
  CardModule
];
@NgModule({
  declarations: [
    PaymentOrderComponent,
    PaymentOrderListComponent,
    PaymentOrderEditComponent,
    PaymentOrderDetailsComponent,
    PaymentOrderAttachmentsComponent,
    PaymentOrderSearchBarComponent,
    PaymentOrderListSearchComponent,
    PaymentOrderEntryComponent,
    PaymentOrderPrintRowsComponent,
    PaymentOrderPrintComponent
  ],
  imports: [
    CommonModule,
    PaymentOrderRoutingModule,
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
    MatGridListModule,
    MatCardModule,
    MatSelectModule,
    InfiniteScrollModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    NgSelectModule,
    NgbModule,
    ViewsModule,
    FontAwesomeModule
    
  ]
})
export class PaymentOrderModule { }
