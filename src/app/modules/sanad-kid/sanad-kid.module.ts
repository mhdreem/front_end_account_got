import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanadKidRoutingModule } from './sanad-kid-routing.module';
import { SanadKidComponent } from './sanad-kid.component';
import { SanadKidListComponent } from './components/sanad-kid-list/sanad-kid-list.component';
import { SanadKidEditComponent } from './components/sanad-kid-edit/sanad-kid-edit.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SanadKidDetailComponent } from './components/sanad-kid-detail/sanad-kid-detail.component';
import { GridModule } from '@coreui/angular';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import { SanadKidAttachmentsComponent } from './components/sanad-kid-attachments/sanad-kid-attachments.component';
import { OnlyNumber } from '../common-module/directives/onlynumber.directive';
import {MatMenuModule} from '@angular/material/menu';
import {AppModule} from '../../app.module'
import {CommonModuleModule} from '../common-module/common-module.module'
import { CardModule } from '@coreui/angular';
import { SanadKidSearchBarComponent } from './components/sanad-kid-search-bar/sanad-kid-search-bar.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SanadKidListSearchComponent } from './components/sanad-kid-list-search/sanad-kid-list-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewsModule } from '../views/views.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { SanadKidEntryComponent } from './components/sanad-kid-entry/sanad-kid-entry.component';


const Import_Corui = [
  GridModule,
  CardModule
];

@NgModule({
  declarations: [
    SanadKidComponent,
    SanadKidListComponent,
    SanadKidEditComponent,
    SanadKidDetailComponent,
    SanadKidAttachmentsComponent,
    SanadKidSearchBarComponent,
    SanadKidListSearchComponent,
    SanadKidEntryComponent
    
  ],
  imports: [
    CommonModule,
    SanadKidRoutingModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
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
    ViewsModule,
    FontAwesomeModule,
    IconModule,
    NgbDropdownModule
  ],
  providers:[
    IconSetService
  ]
})
export class SanadKidModule { }
