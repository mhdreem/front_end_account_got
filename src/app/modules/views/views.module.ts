import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GridModule, BreadcrumbModule, HeaderModule, DropdownModule, AvatarModule, SidebarModule, NavModule, CardModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToolBarComponent } from './componenets/tool-bar/tool-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentInfoComponent } from './document-info/document-info.component';
import { AutomaticSanadKidComponent } from './automatic-sanad-kid/automatic-sanad-kid.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModuleModule } from '../common-module/common-module.module';


const Import_Materail = [
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  FormsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatButtonModule,
  DragDropModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatIconModule
];


const Import_Corui = [
  GridModule,
  BreadcrumbModule,
  HeaderModule,
  DropdownModule,
  AvatarModule,
  SidebarModule,
  IconModule,
  NavModule,CardModule
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ToolBarComponent,
    DocumentInfoComponent,
    AutomaticSanadKidComponent,
   
  ],
  imports: [
    CommonModule,     
    HttpClientModule,
    Import_Materail, 
    Import_Corui,
    PerfectScrollbarModule,
    NgbModule,    
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
    IconModule
  ],
  exports:[
    ToolBarComponent,
    DocumentInfoComponent,
    AutomaticSanadKidComponent
  ]
})
export class ViewsModule { }
