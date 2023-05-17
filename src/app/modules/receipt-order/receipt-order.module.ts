import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { BreadcrumbModule, GridModule } from '@coreui/angular';
import {MatMenuModule} from '@angular/material/menu';
import {CommonModuleModule} from '../common-module/common-module.module'
import { CardModule } from '@coreui/angular';

import { ReceiptOrderRoutingModule } from './receipt-order-routing.module';
import { ReceiptOrderComponent } from './receipt-order.component';

import {ReceiptOrderAttachmentsComponent} from './components/receipt-order-attachments/receipt-order-attachments.component'
import {ReceiptOrderDetailsComponent} from './components/receipt-order-details/receipt-order-details.component'
import {ReceiptOrderEditComponent} from './components/receipt-order-edit/receipt-order-edit.component'
import {ReceiptOrderListComponent} from './components/receipt-order-list/receipt-order-list.component';
import { ReceiptOrderSearchBarComponent } from './components/receipt-order-search-bar/receipt-order-search-bar.component'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { ReceiptOrderListSearchComponent } from './components/receipt-order-list-search/receipt-order-list-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewsModule } from '../views/views.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReceiptOrderEntryComponent } from './components/receipt-order-entry/receipt-order-entry.component';
import { ReceiptOrderPrintRowsComponent } from './components/receipt-order-print-rows/receipt-order-print-rows.component';
import { ReceiptOrderPrintComponent } from './components/receipt-order-print/receipt-order-print.component';

const Import_Corui = [
  GridModule,
  CardModule,
  BreadcrumbModule
];

@NgModule({
  declarations: [
    ReceiptOrderComponent,
    ReceiptOrderListComponent,
    ReceiptOrderEditComponent,
    ReceiptOrderDetailsComponent,
    ReceiptOrderAttachmentsComponent,
    ReceiptOrderSearchBarComponent,
    ReceiptOrderListSearchComponent,
    ReceiptOrderEntryComponent,
    ReceiptOrderPrintRowsComponent,
    ReceiptOrderPrintComponent

  ],
  imports: [
    CommonModule,
    ReceiptOrderRoutingModule,
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
    NgbModule ,    
    ViewsModule,
    FontAwesomeModule
  ]
})
export class ReceiptOrderModule { }
