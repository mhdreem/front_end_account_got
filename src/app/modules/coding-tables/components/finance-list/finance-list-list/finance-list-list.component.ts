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
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import {finance_list} from '../../../../shared/models/finance_list'
import { FinanceListAddComponent } from '../finance-list-add/finance-list-add.component';
@Component({
  selector: 'app-finance-list-list',
  templateUrl: './finance-list-list.component.html',
  styleUrls: ['./finance-list-list.component.scss']
})
export class FinanceListListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  finance_list_List: finance_list[] = [];
  dataSource = new MatTableDataSource<finance_list>();
  displayedColumns: string[] = ['finance_list_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();

  excelData: any[] = [];

  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'القوائم المالية',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم القائمة المالية']
  };

  selectedFile:any;

  isLoading: boolean= false;

  constructor(public dialog: MatDialog,
    private financeListService: FinanceListService,
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
      this.financeListService.list().subscribe(
        res => {
          if (res != null)
            this.finance_list_List = res;
          this.dataSource.data = this.finance_list_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(FinanceListAddComponent, {
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

  update(obj: finance_list) {

    const dialogRef = this.dialog.open(FinanceListAddComponent, {
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



  delete(obj: finance_list) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.financeListService.delete(obj.finance_list_seq!).subscribe
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
   
    moveItemInArray(this.finance_list_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.finance_list_List;
    let orderReq: any[] = [];
    this.finance_list_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.finance_list_seq, order: index });
    });
    this.financeListService.orderRow(orderReq).subscribe(
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
    this.financeListService.importExcel(formData).subscribe(res=>{
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
