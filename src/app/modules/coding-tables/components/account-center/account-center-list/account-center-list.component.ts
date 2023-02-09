import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { account_center } from 'src/app/modules/shared/models/account-center';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountCenterAddComponent } from '../account-center-add/account-center-add.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { result } from 'src/app/modules/shared/models/result';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { ExportToCsv } from 'export-to-csv';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ImportFromExcelComponent } from 'src/app/modules/shared/components/import-from-excel/import-from-excel.component';
@Component({
  selector: 'app-account-center-list',
  templateUrl: './account-center-list.component.html',
  styleUrls: ['./account-center-list.component.scss']
})
export class AccountCenterListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  account_center_List: account_center[] = [];
  dataSource = new MatTableDataSource<account_center>();
  displayedColumns: string[] = ['account_center_id', 'account_center_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();

  excelData: any[] = [];

  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'مراكز الكلفة',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['رقم المركز', 'اسم المركز']
  };

  selectedFile:any;



  constructor(public dialog: MatDialog,
    private accountCenterService: account_centerService,
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
      this.accountCenterService.list().subscribe(
        res => {
          if (res != null)
            this.account_center_List = res;
          this.dataSource.data = this.account_center_List;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(AccountCenterAddComponent, {
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

  update(obj: account_center) {

    const dialogRef = this.dialog.open(AccountCenterAddComponent, {
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



  delete(obj: account_center) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.accountCenterService.delete(obj.account_center_seq!).subscribe
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
   
    moveItemInArray(this.account_center_List, event.previousIndex, event.currentIndex);
    console.log('this.account_center_List', this.account_center_List);
    this.dataSource.data = this.account_center_List;
    let orderReq: any[] = [];
    this.account_center_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.account_center_seq, order: index });
    });
    console.log('orderReq', orderReq);
    this.accountCenterService.orderRow(orderReq).subscribe(
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
    this.accountCenterService.importExcel(formData).subscribe(res=>{
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
