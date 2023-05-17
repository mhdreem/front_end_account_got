import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ExportToCsv } from "export-to-csv";
import { Subscription } from "rxjs";
import { ConfirmationdialogComponent } from "src/app/modules/shared/components/confirmationdialog/confirmationdialog.component";
import { ImportFromExcelComponent } from "src/app/modules/shared/components/import-from-excel/import-from-excel.component";
import { account_center } from "src/app/modules/shared/models/account_center";
import { result } from "src/app/modules/shared/models/result";
import { sub_financial_list } from "src/app/modules/shared/models/sub_financial_list";
import { SubFinancialListService } from "src/app/modules/shared/services/sub_financial_list.service";
import { AccountCenterAddComponent } from "../../account-center/account-center-add/account-center-add.component";
import { SubFinancialListAddComponent } from "../sub-financial-list-add/sub-financial-list-add.component";

@Component({
  selector: 'app-sub-financial-list-list',
  templateUrl: './sub-financial-list-list.component.html',
  styleUrls: ['./sub-financial-list-list.component.scss']
})
export class SubFinancialListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  List_sub_financial_list: sub_financial_list[] = [];
  dataSource = new MatTableDataSource<sub_financial_list>();
  displayedColumns: string[] = ['sub_financial_list_name','direct_cost_center_fk','indirect_cost_center_fk', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();

  excelData: any[] = [];

  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'القوائم الفرعية',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['رقم المركز', 'اسم المركز']
  };

  selectedFile:any;

  isLoading: boolean= false;

  constructor(public dialog: MatDialog,
    private subFinancialListService: SubFinancialListService,
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
      this.subFinancialListService.list().subscribe(
        res => {
          if (res != null)
            this.List_sub_financial_list = res;
          this.dataSource.data = this.List_sub_financial_list;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(SubFinancialListAddComponent, {
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

  update(obj: account_center) {

    const dialogRef = this.dialog.open(SubFinancialListAddComponent, {
      width: '600px',
      position: {top: "8%" },
      data: {
        obj: obj
      }
    });


    dialogRef.afterClosed().subscribe(result => {

        this.LoadData();

    });
  }



  delete(obj: sub_financial_list) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.subFinancialListService.delete(obj.sub_financial_list_seq!).subscribe
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




  

  
  


  exportToExcel() {

    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }

 view(){
  this.LoadData();
 }
}
