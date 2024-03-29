import { Component , ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportToCsv } from 'export-to-csv';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { ImportFromExcelComponent } from 'src/app/modules/shared/components/import-from-excel/import-from-excel.component';
import { beneficiary_type } from 'src/app/modules/shared/models/beneficiary-type';
import { result } from 'src/app/modules/shared/models/result';
import { BeneficiaryTypeService } from 'src/app/modules/shared/services/beneficiary-type.service';
import { BeneficiaryTypeEditComponent } from '../beneficiary-type-edit/beneficiary-type-edit.component';

@Component({
  selector: 'app-beneficiary-type-list',
  templateUrl: './beneficiary-type-list.component.html',
  styleUrls: ['./beneficiary-type-list.component.scss']
})
export class BeneficiaryTypeListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  beneficiaryType_List: beneficiary_type[] = [];
  dataSource = new MatTableDataSource<beneficiary_type>();
  displayedColumns: string[] = ['beneficiary_type_name','beneficiary_type_code','beneficiary_type_note',  'action'];
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
    title: 'نوع المستفيد',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم المستفيد']
  };

  selectedFile:any;



  constructor(public dialog: MatDialog,
    private beneficiaryTypeService: BeneficiaryTypeService,
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
      this.beneficiaryTypeService.list().subscribe(
        res => {
          if (res != null)
            this.beneficiaryType_List = res;
          this.dataSource.data = this.beneficiaryType_List;
          this.isLoading= false;

        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(BeneficiaryTypeEditComponent, {
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

  update(obj: beneficiary_type) {

    const dialogRef = this.dialog.open(BeneficiaryTypeEditComponent, {
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



  delete(obj: beneficiary_type) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.beneficiaryTypeService.delete(obj.beneficiary_type_seq!).subscribe
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



  // drop(event: CdkDragDrop<string[]>) {
   
  //   moveItemInArray(this.beneficiaryType_List, event.previousIndex, event.currentIndex);
  //   this.dataSource.data = this.beneficiaryType_List;
  //   let orderReq: any[] = [];
  //   this.beneficiaryType_List.forEach((ele, index) => {
  //     orderReq.push({ pk: ele.beneficiaryType_seq, order: index });
  //   });
  //   console.log('orderReq', orderReq);
  //   this.beneficiaryTypeService.orderRow(orderReq).subscribe(
  //     result =>
  //     {

  //     }
  //   );
  // }

  

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
    this.beneficiaryTypeService.importExcel(formData).subscribe(res=>{
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
