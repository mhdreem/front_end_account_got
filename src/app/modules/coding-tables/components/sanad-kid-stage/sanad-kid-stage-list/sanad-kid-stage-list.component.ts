import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sanad_kid_stage } from 'src/app/modules/shared/models/sanad_kid_stage';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SanadKidStageService } from 'src/app/modules/shared/services/sanad-kid-stage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { result } from 'src/app/modules/shared/models/result';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SanadKidStageAddComponent } from '../sanad-kid-stage-add/sanad-kid-stage-add.component';

@Component({
  selector: 'app-sanad-kid-stage-list',
  templateUrl: './sanad-kid-stage-list.component.html',
  styleUrls: ['./sanad-kid-stage-list.component.scss']
})
export class SanadKidStageListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Sanad_kid_stage_List: Sanad_kid_stage[] = [];
  dataSource = new MatTableDataSource<Sanad_kid_stage>();
  displayedColumns: string[] = ['ex_ord_stg_name', 'action'];
  pageSizeOptions: number[] = [20, 40, 60];
  isLoading: boolean= false;
  Subscription: Subscription = new Subscription();




  constructor(public dialog: MatDialog,
    private sanadKidStageService: SanadKidStageService,
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
      this.sanadKidStageService.list().subscribe(
        (res: any) => {
          if (res != null)
            this.Sanad_kid_stage_List = res.value;
          this.dataSource.data = this.Sanad_kid_stage_List;
          this.isLoading= false;
        }
      )
    );
  }


  add() {
    const dialogRef = this.dialog.open(SanadKidStageAddComponent, {
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

  update(obj: Sanad_kid_stage) {

    const dialogRef = this.dialog.open(SanadKidStageAddComponent, {
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



  delete(obj: Sanad_kid_stage) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '300px',
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result == 1)
      this.sanadKidStageService.delete(obj.snd_kid_stg_seq!).subscribe
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
   
    moveItemInArray(this.Sanad_kid_stage_List, event.previousIndex, event.currentIndex);
    this.dataSource.data = this.Sanad_kid_stage_List;
    let orderReq: any[] = [];
    this.Sanad_kid_stage_List.forEach((ele, index) => {
      orderReq.push({ pk: ele.snd_kid_stg_seq, order: index });
    })
    this.sanadKidStageService.orderRow(orderReq);
  }

  view(){
    this.LoadData();
   }
}
