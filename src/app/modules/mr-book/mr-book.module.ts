import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MrBookRoutingModule } from './mr-book-routing.module';
import { MrBookComponent } from './mr-book.component';
import { MrBookListComponent } from './components/mr-book-list/mr-book-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModuleModule } from '../common-module/common-module.module';
import { CardModule, GridModule } from '@coreui/angular';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgSelectModule } from '@ng-select/ng-select';

const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    MrBookComponent,
    MrBookListComponent
  ],
  imports: [
    CommonModule,
    MrBookRoutingModule,
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
    MatSelectModule,
    MatProgressBarModule,
    NgSelectModule
  ]
})
export class MrBookModule { }
