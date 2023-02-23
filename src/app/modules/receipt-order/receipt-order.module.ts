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
import { GridModule } from '@coreui/angular';
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
const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    ReceiptOrderComponent,
    ReceiptOrderListComponent,
    ReceiptOrderEditComponent,
    ReceiptOrderDetailsComponent,
    ReceiptOrderAttachmentsComponent,
    ReceiptOrderSearchBarComponent,
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
  ]
})
export class ReceiptOrderModule { }
