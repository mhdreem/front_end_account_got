import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { result } from 'src/app/modules/shared/models/result';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { Subscription } from 'rxjs';
import { AttachmentTypeAddComponent } from '../attachment-type-add/attachment-type-add.component';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { ImportFromExcelComponent } from 'src/app/modules/shared/components/import-from-excel/import-from-excel.component';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-attachment-type-list',
  templateUrl: './attachment-type-list.component.html',
  styleUrls: ['./attachment-type-list.component.scss']
})
export class AttachmentTypeListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  attachment_type_List: attachement_type[] = [];
  dataSource = new MatTableDataSource<attachement_type>();
  displayedColumns: string[] = ['attachement_type_name','attachement_type_order', 'action'];
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
    title: 'نوع المرفقات',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['اسم نوع المرفق']
  };

  selectedFile:any;



  constructor(public dialog: MatDialog,
    private attachmentTypeService: AttachmentTypeService,
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
      this.attachmentTypeService.list().subscribe(
        res => {
          if (res != null)
            this.attachment_type_List = res;
          this.dataSource.data = this.attachment_type_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(AttachmentTypeAddComponent, {
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

  update(obj: attachement_type) {

    const dialogRef = this.dialog.open(AttachmentTypeAddComponent, {
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



  delete(obj: attachement_type) {

    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.attachmentTypeService.delete(obj.attachement_type_seq!).subscribe
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
   
    moveItemInArray(this.attachment_type_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.attachment_type_List;
    let orderReq: any[] = [];
    this.attachment_type_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.attachement_type_seq, order: index });
    });
    this.attachmentTypeService.orderRow(orderReq).subscribe(
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
    this.attachmentTypeService.importExcel(formData).subscribe(res=>{
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
