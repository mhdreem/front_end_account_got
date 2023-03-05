import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { result } from 'src/app/modules/shared/models/result';
import { PaymentOrderStageService } from 'src/app/modules/shared/services/payment-order-stage.service';
import {payment_order_stage} from '../../../../shared/models/payment_order_stage'
import { PaymentOrderStageAddComponent } from '../payment-order-stage-add/payment-order-stage-add.component';

@Component({
  selector: 'app-payment-order-stage-list',
  templateUrl: './payment-order-stage-list.component.html',
  styleUrls: ['./payment-order-stage-list.component.scss']
})
export class PaymentOrderStageListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  payment_order_stage_List: payment_order_stage[] = [];
  dataSource = new MatTableDataSource<payment_order_stage>();
  displayedColumns: string[] = ['pay_ord_stg_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private paymentOrderStageService: PaymentOrderStageService,
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
      this.paymentOrderStageService.list().subscribe(
        (res: any) => {
          if (res != null)
            this.payment_order_stage_List = res.value;
          this.dataSource.data = this.payment_order_stage_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(PaymentOrderStageAddComponent, {
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

  update(obj: payment_order_stage) {

    const dialogRef = this.dialog.open(PaymentOrderStageAddComponent, {
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



  delete(obj: payment_order_stage) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.paymentOrderStageService.delete(obj.pay_ord_stg_seq!).subscribe
      (
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success){

            this._snaker.open('تم الحذف بنجاح', '', {
              duration: 3000,
            });
            this.LoadData();
          }
        else 
        {
          this._snaker.open('لم يتم الحذف بنجاح','',{});
        
        }
        }
      );
    });



  }



  drop(event: CdkDragDrop<string[]>) {
   
    moveItemInArray(this.payment_order_stage_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.payment_order_stage_List;
    let orderReq: any[] = [];
    this.payment_order_stage_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.pay_ord_stg_seq, order: index });
    })
    this.paymentOrderStageService.orderRow(orderReq);
  }
}
