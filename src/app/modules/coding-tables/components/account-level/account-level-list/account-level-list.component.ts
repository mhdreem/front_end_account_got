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
import { result } from 'src/app/modules/shared/models/result';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import {account_level} from '../../../../shared/models/account_level'
import { AccountLevelAddComponent } from '../account-level-add/account-level-add.component';
@Component({
  selector: 'app-account-level-list',
  templateUrl: './account-level-list.component.html',
  styleUrls: ['./account-level-list.component.scss']
})
export class AccountLevelListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  account_level_List: account_level[] = [];
  dataSource = new MatTableDataSource<account_level>();
  displayedColumns: string[] = ['account_level_name', 'action'];
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
    title: 'مستوى الحسابات',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم مستوى الحساب']
  };

  selectedFile:any;



  constructor(public dialog: MatDialog,
    private accountLevelService: AccountLevelService,
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
      this.accountLevelService.list().subscribe(
        res => {
          if (res != null)
            this.account_level_List = res;
          this.dataSource.data = this.account_level_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(AccountLevelAddComponent, {
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

  update(obj: account_level) {

    const dialogRef = this.dialog.open(AccountLevelAddComponent, {
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



  delete(obj: account_level) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.accountLevelService.delete(obj.account_level_seq!).subscribe
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
   
    moveItemInArray(this.account_level_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.account_level_List;
    let orderReq: any[] = [];
    this.account_level_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.account_level_seq, order: index });
    });
    this.accountLevelService.orderRow(orderReq).subscribe(
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
    this.accountLevelService.importExcel(formData).subscribe(res=>{
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
}
