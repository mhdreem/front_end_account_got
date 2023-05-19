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
import { AccountClassification } from 'src/app/modules/shared/models/account-classification';
import { result } from 'src/app/modules/shared/models/result';
import { AccountclassificationService } from 'src/app/modules/shared/services/account-classification.service';
import { AccountClassificationAddComponent } from '../account-classification-add/account-classification-add.component';

@Component({
  selector: 'app-account-classification-list',
  templateUrl: './account-classification-list.component.html',
  styleUrls: ['./account-classification-list.component.scss']
})
export class AccountClassificationListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  AccountClassification_List: AccountClassification[] = [];
  dataSource = new MatTableDataSource<AccountClassification>();
  displayedColumns: string[] = ['classification_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
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
    private accountclassificationService: AccountclassificationService,
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
    this.isLoading= true;

    this.Subscription.add(
      this.accountclassificationService.list().subscribe(
        res => {
          if (res != null)
            this.AccountClassification_List = res;
          this.dataSource.data = this.AccountClassification_List;
          this.isLoading= false;

        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(AccountClassificationAddComponent, {
      width: '600px',
      position: {top: "8%" },
      data: {
        obj: null
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.LoadData();
    });
  }

  update(obj: AccountClassification) {

    const dialogRef = this.dialog.open(AccountClassificationAddComponent, {
      width: '600px',
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



  delete(obj: AccountClassification) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.accountclassificationService.delete(obj.classification_seq!).subscribe
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
   
    moveItemInArray(this.AccountClassification_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.AccountClassification_List;
    let orderReq: any[] = [];
    this.AccountClassification_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.classification_seq, order: index });
    });
    console.log('orderReq', orderReq);
    this.accountclassificationService.orderRow(orderReq).subscribe(
      result =>
      {

      }
    );
  }

  

  importFromExcelClicked(){
    const dialogRef = this.dialog.open(ImportFromExcelComponent, {
      width: '600px',
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
    this.accountclassificationService.importExcel(formData).subscribe(res=>{
      if (res != null && (res as result)!= null &&  (res as result).success){
  
        this._snaker.open('تم الاستيراد بنجاح', '', {
          duration: 3000,
          panelClass: ['green-snackbar']
        });
        this.LoadData();
      }
    else 
    {
      this._snaker.open('لم يتم الاستيراد بنجاح','',{panelClass: ['red-snackbar']});
    
    }
    })
  }


  exportToExcel() {

    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }

 view(){
  this.LoadData();
 }
}
