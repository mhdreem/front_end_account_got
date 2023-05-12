import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationdialogComponent } from './modules/shared/components/confirmationdialog/confirmationdialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GridModule } from '@coreui/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImportFromExcelComponent } from './modules/shared/components/import-from-excel/import-from-excel.component';
import {MatIconModule} from '@angular/material/icon';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './modules/shared/components/containers';
import { BreadcrumbModule } from '@coreui/angular';
import { HeaderModule } from '@coreui/angular';
import { DropdownModule } from '@coreui/angular';
import { AvatarModule } from '@coreui/angular';
import { SidebarModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import {LoginComponent} from './modules/shared/components/login/login.component'


import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { SelectColumnsComponent } from './modules/shared/components/select-columns/select-columns.component';
import {NgxPrintModule} from 'ngx-print';

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
  
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationdialogComponent,
    ImportFromExcelComponent,
    DefaultFooterComponent,
     DefaultHeaderComponent,
      DefaultLayoutComponent ,
      LoginComponent,
      
  ],
  imports:
    [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      Import_Materail, 
      Import_Corui,
      PerfectScrollbarModule,
      NgxPrintModule

    ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    IconSetService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    
  {
    provide: HTTP_INTERCEPTORS,     
    useClass: TokenInterceptor,

    multi: true
  }
  ],

  
 
  bootstrap: [AppComponent]
})
export class AppModule {
}
