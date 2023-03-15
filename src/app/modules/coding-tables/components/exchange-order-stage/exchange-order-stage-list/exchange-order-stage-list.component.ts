import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { exchange_order_stage } from 'src/app/modules/shared/models/exchange_order_stage';
import { result } from 'src/app/modules/shared/models/result';
import { ExchangeOrderStageService } from 'src/app/modules/shared/services/exchange-order-stage.service';
import { ExchangeOrderStageAddComponent } from '../exchange-order-stage-add/exchange-order-stage-add.component';

@Component({
  selector: 'app-exchange-order-stage-list',
  templateUrl: './exchange-order-stage-list.component.html',
  styleUrls: ['./exchange-order-stage-list.component.scss']
})
export class ExchangeOrderStageListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Exchange_order_stage_List: exchange_order_stage[] = [];
  dataSource = new MatTableDataSource<exchange_order_stage>();
  displayedColumns: string[] = ['ex_ord_stg_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private exchangeOrderStageService: ExchangeOrderStageService,
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
      this.exchangeOrderStageService.list().subscribe(
        (res: any) => {
          if (res != null)
            this.Exchange_order_stage_List = res.value;
          this.dataSource.data = this.Exchange_order_stage_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(ExchangeOrderStageAddComponent, {
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

  update(obj: exchange_order_stage) {

    const dialogRef = this.dialog.open(ExchangeOrderStageAddComponent, {
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



  delete(obj: exchange_order_stage) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.exchangeOrderStageService.delete(obj.ex_ord_stg_seq!).subscribe
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
   
    moveItemInArray(this.Exchange_order_stage_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.Exchange_order_stage_List;
    let orderReq: any[] = [];
    this.Exchange_order_stage_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.ex_ord_stg_seq, order: index });
    })
    this.exchangeOrderStageService.orderRow(orderReq);
  }

  view(){
    this.LoadData();
   }
}
