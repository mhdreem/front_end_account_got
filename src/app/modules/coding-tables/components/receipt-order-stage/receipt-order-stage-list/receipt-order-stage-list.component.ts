import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { receipt_order_stage } from 'src/app/modules/shared/models/receipt_order_stage';
import { result } from 'src/app/modules/shared/models/result';
import { ReceiptOrderStageService } from 'src/app/modules/shared/services/receipt-order-stage.service';
import { ReceiptOrderStageAddComponent } from '../receipt-order-stage-add/receipt-order-stage-add.component';

@Component({
  selector: 'app-receipt-order-stage-list',
  templateUrl: './receipt-order-stage-list.component.html',
  styleUrls: ['./receipt-order-stage-list.component.scss']
})
export class ReceiptOrderStageListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  receipt_order_stage_List: receipt_order_stage[] = [];
  dataSource = new MatTableDataSource<receipt_order_stage>();
  displayedColumns: string[] = ['rec_ord_stg_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private receiptOrderStageService: ReceiptOrderStageService,
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
      this.receiptOrderStageService.list().subscribe(
        (res: any) => {
          if (res != null)
            this.receipt_order_stage_List = res.value;
          this.dataSource.data = this.receipt_order_stage_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(ReceiptOrderStageAddComponent, {
      width: '400px',
      position: {top: "8%" },
      data: {
        obj: null
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.LoadData();
    });
  }

  update(obj: receipt_order_stage) {

    const dialogRef = this.dialog.open(ReceiptOrderStageAddComponent, {
      width: '400px',
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



  delete(obj: receipt_order_stage) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.receiptOrderStageService.delete(obj.rec_ord_stg_seq!).subscribe
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
   
    moveItemInArray(this.receipt_order_stage_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.receipt_order_stage_List;
    let orderReq: any[] = [];
    this.receipt_order_stage_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.rec_ord_stg_seq, order: index });
    })
    this.receiptOrderStageService.orderRow(orderReq);
  }

  view(){
    this.LoadData();
   }
}
