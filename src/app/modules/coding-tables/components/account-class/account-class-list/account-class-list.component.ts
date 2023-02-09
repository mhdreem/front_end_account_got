import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportToCsv } from 'export-to-csv';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { ImportFromExcelComponent } from 'src/app/modules/shared/components/import-from-excel/import-from-excel.component';
import { account_class } from 'src/app/modules/shared/models/account-class';
import { result } from 'src/app/modules/shared/models/result';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountClassAddComponent } from '../account-class-add/account-class-add.component';

@Component({
  selector: 'app-account-class-list',
  templateUrl: './account-class-list.component.html',
  styleUrls: ['./account-class-list.component.scss']
})
export class AccountClassListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  account_class_List: account_class[] = [];
  dataSource = new MatTableDataSource<account_class>();
  displayedColumns: string[] = ['account_class_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();

  excelData: any[] = [];

  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'تصنيفات الحسابات',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم التصنيف']
  };

  selectedFile:any;



  constructor(public dialog: MatDialog,
    private accountClassService: AccountClassService,
    private _snaker: MatSnackBar,
    
  ) {
    
    this.LoadData();
  }

  ngOnDestroy(): void {
    if (Subscription != null) this.Subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();
  }


  LoadData() {
    this.Subscription.add(
      this.accountClassService.list().subscribe(
        res => {
          if (res != null)
            this.account_class_List = res;
          this.dataSource.data = this.account_class_List;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(AccountClassAddComponent, {
      width: '300px',
      position: {top: "8%" },
      data: {
        obj: null
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.LoadData();
    });
  }

  update(obj: account_class) {

    const dialogRef = this.dialog.open(AccountClassAddComponent, {
      width: '300px',
      position: {top: "8%" },
      data: {
        obj: obj
      }
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == true)
        this.LoadData();

    });
  }



  delete(obj: account_class) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.accountClassService.delete(obj.account_class_seq!).subscribe
      (
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success){

            this._snaker.open('تم الحذف بنجاح', '', {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
            this.LoadData();
          }
        else 
        {
          this._snaker.open('لم يتم الحذف بنجاح','',{panelClass: ['red-snackbar']});
        
        }
        }
      );
    });


    


  }



  drop(event: CdkDragDrop<string[]>) {
   
    moveItemInArray(this.account_class_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.account_class_List;
    let orderReq: any[] = [];
    this.account_class_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.account_class_seq, order: index });
    });
    console.log('orderReq', orderReq);
    this.accountClassService.orderRow(orderReq).subscribe(
      result =>
      {

      }
    );
  }

  

  importFromExcelClicked(){
    const dialogRef = this.dialog.open(ImportFromExcelComponent, {
      width: '300px',
      data: '',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != 'false'){
        this.selectedFile= result;
        this.importFromExcel();
      }
      
    })
  }

  importFromExcel(){
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.accountClassService.importExcel(formData).subscribe(res=>{
      if (res != null && (res as result)!= null &&  (res as result).success){
  
        this._snaker.open('تم الاستيراد بنجاح', '', {
          duration: 3000,
        });
        this.LoadData();
      }
    else 
    {
      this._snaker.open('لم يتم الاستيراد بنجاح','',{});
    
    }
    })
  }


  exportToExcel() {

    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }
}
