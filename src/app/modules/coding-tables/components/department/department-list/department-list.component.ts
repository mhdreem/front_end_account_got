import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { department } from 'src/app/modules/shared/models/department';
import { result } from 'src/app/modules/shared/models/result';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import {DepartmentAddComponent} from '../department-add/department-add.component';
@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  department_List: department[] = [];
  dataSource = new MatTableDataSource<department>();
  displayedColumns: string[] = ['department_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private departmentService: DepartmentService,
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
      this.departmentService.list().subscribe(
        res => {
          if (res != null)
            this.department_List = res;
          this.dataSource.data = this.department_List;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(DepartmentAddComponent, {
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

  update(obj: department) {

    const dialogRef = this.dialog.open(DepartmentAddComponent, {
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



  delete(obj: department) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.departmentService.delete(obj.department_seq!).subscribe
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
   
    moveItemInArray(this.department_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.department_List;
    let orderReq: any[] = [];
    this.department_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.department_seq, order: index });
    })
    this.departmentService.orderRow(orderReq);
  }
}
