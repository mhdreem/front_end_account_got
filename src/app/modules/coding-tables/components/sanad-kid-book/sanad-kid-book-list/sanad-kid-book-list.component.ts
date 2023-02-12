import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { result } from 'src/app/modules/shared/models/result';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import {SanadKidBook} from '../../../../shared/models/sanad-kid-book'
import { SanadKidBookAddComponent } from '../sanad-kid-book-add/sanad-kid-book-add.component';

@Component({
  selector: 'app-sanad-kid-book-list',
  templateUrl: './sanad-kid-book-list.component.html',
  styleUrls: ['./sanad-kid-book-list.component.scss']
})
export class SanadKidBookListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sanadKidBook_List: SanadKidBook[] = [];
  dataSource = new MatTableDataSource<SanadKidBook>();
  displayedColumns: string[] = ['sanad_kid_book_name', 'account_name', 'incumbent_id_generate_type_fk', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];

  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private _snaker: MatSnackBar,
    private sanadKidBookService: SanadKidBookService
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
      this.sanadKidBookService.list().subscribe(
        res => {
          if (res != null)
            this.sanadKidBook_List = res;
          this.dataSource.data = this.sanadKidBook_List;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(SanadKidBookAddComponent, {
      width: '350px',
      position: {top: "8%" },
      data: {
        obj: null
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.LoadData();
    });
  }

  update(obj: SanadKidBook) {

    const dialogRef = this.dialog.open(SanadKidBookAddComponent, {
      width: '350px',
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



  delete(obj: SanadKidBook) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.sanadKidBookService.delete(obj.sanad_kid_book_seq!).subscribe
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
   
    moveItemInArray(this.sanadKidBook_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.sanadKidBook_List;
    let orderReq: any[] = [];
    this.sanadKidBook_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.sanad_kid_book_seq, order: index });
    })
    this.sanadKidBookService.orderRow(orderReq);
  }
}
