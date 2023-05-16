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
import { payment_safe } from 'src/app/modules/shared/models/payment_safe';
import { result } from 'src/app/modules/shared/models/result';
import { FinanceListAddComponent } from '../../finance-list/finance-list-add/finance-list-add.component';
import { PaymentSafeService } from 'src/app/modules/shared/services/payment_safe.service';
import { PaymentSafeAddComponent } from '../payment_safe-add/payment_safe-add.component';

@Component({
  selector: 'app-payment_safe-list',
  templateUrl: './payment_safe-list.component.html',
  styleUrls: ['./payment_safe-list.component.scss']
})
export class PaymentSafeListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  payment_safe_List: payment_safe[] = [];
  dataSource = new MatTableDataSource<payment_safe>();
  displayedColumns: string[] = ['payment_safe_name','accounts_tree_fk' ,'payment_safe_order', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();

  excelData: any[] = [];

  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'الصناديق',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم الصندوق']
  };

  selectedFile:any;

  isLoading: boolean= false;

  constructor(public dialog: MatDialog,
    private PaymentSafeService: PaymentSafeService,
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
      this.PaymentSafeService.list().subscribe(
        res => {
          if (res != null)
            this.payment_safe_List = res;
          this.dataSource.data = this.payment_safe_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(PaymentSafeAddComponent, {
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

  update(obj: payment_safe) {

    const dialogRef = this.dialog.open(PaymentSafeAddComponent, {
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



  delete(obj: payment_safe) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.PaymentSafeService.delete(obj.payment_safe_seq!).subscribe
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
   
    moveItemInArray(this.payment_safe_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.payment_safe_List;
    let orderReq: any[] = [];
    this.payment_safe_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.payment_safe_seq, order: index });
    });
    this.PaymentSafeService.orderRow(orderReq).subscribe(
      result =>
      {

      }
    );
  }

  

  

 

  exportToExcel() {

    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }

 view(){
  this.LoadData();
 }
}
