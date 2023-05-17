import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { branch } from 'src/app/modules/shared/models/branch';
import { result } from 'src/app/modules/shared/models/result';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import {BranchAddComponent} from '../branch-add/branch-add.component'
@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  branch_List: branch[] = [];
  dataSource = new MatTableDataSource<branch>();
  displayedColumns: string[] = ['branch_name', 'branch_address', 'branch_phone', 'branch_email', 'branch_website' ,'action'];

  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private branchService: BranchService,   
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
      this.branchService.list().subscribe(
        res => {
          if (res != null)
            this.branch_List = res;
            this.dataSource.data = this.branch_List;
            this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(BranchAddComponent, {
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

  update(obj: branch) {

    const dialogRef = this.dialog.open(BranchAddComponent, {
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



  delete(obj: branch) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '600px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.branchService.delete(obj.branch_seq!).subscribe
      (
        res => {
          console.log('res', res);
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
   
    moveItemInArray(this.branch_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.branch_List;
    let orderReq: any[] = [];
    this.branch_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.branch_seq, order: index });
    })
    this.branchService.orderRow(orderReq);
  }

  view(){
    this.LoadData();
   }
}
