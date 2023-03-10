import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { sanad_kid } from 'src/app/modules/shared/models/sanad-kid';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { SanadKidService } from 'src/app/modules/shared/services/sanad-kid.service';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { SanadKidEditComponent } from '../sanad-kid-edit/sanad-kid-edit.component';
import * as moment from 'moment';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { sanad_kid_detail } from 'src/app/modules/shared/models/sanad_kid_detail';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { Route, Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-sanad-kid-list',
  templateUrl: './sanad-kid-list.component.html',
  styleUrls: ['./sanad-kid-list.component.scss']
})
export class SanadKidListComponent implements OnInit {

  
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 123){
      event.preventDefault();
      this.add();
    }
    if(event.keyCode == 119){
      event.preventDefault();
      this.View();
    }
    if(event.keyCode == 118){
      event.preventDefault();
      this.exportToExcel();
    }
    
  }

  // formname:string = '?????? ???????????? ??????????????';
  LoadingFinish : boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<sanad_kid>();
  displayedColumns: string[] =
   ['date_time_create', 'document_id','document_date', 'sanad_total_value', 'incumbent_id', 'incumbent_date', 'sanad_close', 'name_of_owner', 'branch_name', 'action' ];
   dataSourceIsEmpty: boolean= true;
  fromDateDay: string= '';
  fromDateMonth: string= '';
  fromDateYear: string= '';
  toDateDay: string= '';
  toDateMonth: string= '';
  toDateYear: string= '';

  fromDateDayIsFilled: boolean= false;
  fromDateMonthIsFilled: boolean= false;
  fromDateYearIsFilled: boolean= false;
  toDateDayIsFilled: boolean= false;
  toDateMonthIsFilled: boolean= false;
  toDateYearIsFilled: boolean= false;

  Form!: FormGroup;
  sanad_kid_date_from!: FormControl<Date | null>;
  sanad_kid_date_to!: FormControl<Date | null>;
  sanad_kid_seq!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  sanad_kid_id_from!: FormControl<number | null>;
  sanad_kid_id_to!: FormControl<number | null>;
  sanad_close!: FormControl<number | null>;
  name_of_owner!: FormControl<string | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;
  

  
  

 

  // Filtering
  // accountType_List: AccountType[] = [];
  // filteredAccountTypeOptions!: Observable<AccountType[]>;
 
 

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;
  selected_sanad: sanad_kid= {};



  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidService: SanadKidService,
    private account_centerService: account_centerService,
    private accountTreeService: AccountTreeService,
    private router: Router
    ) {
    this.LoadingFinish = true;

      this.BuildForm();

     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'sanad_kid_date_from': this.sanad_kid_date_from = new FormControl<Date | null>(null, []),
            'sanad_kid_date_to': this.sanad_kid_date_to = new FormControl<Date | null>(null, []),
            'sanad_kid_seq': this.sanad_kid_seq = new FormControl<number | null>(null, []),
            'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
            'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
            'sanad_kid_id_from': this.sanad_kid_id_from = new FormControl<number | null>(null, []),
            'sanad_kid_id_to': this.sanad_kid_id_to = new FormControl<number | null>(null, []),
            'sanad_close': this.sanad_close = new FormControl<number | null>(null, []),
            'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
            'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
          }
        );
        
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
  
    
  
    
   

  ngOnInit(): void {
    // this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
    //   this.darkTheme= res;
    // })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.View();
        })
      )
      .subscribe((data: any) => {
        this.totalRows = data.total_row_count;
        this.dataSource = new MatTableDataSource(data.value);
        this.isLoading= false;
        if (data.value?.length != 0)
          this.dataSourceIsEmpty= false;
      });
  }

  rowClicked!: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  onViewClick(){
    this.currentPage=0;
    this.pageSize=5;
    this.View().subscribe((data: any)=>{
      this.totalRows = data.total_row_count;
      this.dataSource = new MatTableDataSource(data.value);
      this.isLoading= false;
      if (data.value?.length != 0)
        this.dataSourceIsEmpty= false;
    });
  }
  

  View(){
    this.isLoading= true;

    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);

    return this.sanadKidService.search(this.Form.value);

    // let printRequest= {
    //   "year_id": this.UpgradeYear.value,
    //   "class_id": this.Class.value,
    //   "jobname_id": this.JobName.value,
    //   "accounter_id": this.Accounter.value,
    //   "qualitygrade": this.Rank.value,
    //   "id_start": this.idStart.value,
    //   "id_end": this.idEnd.value,
    //   "type_display_Option": this.TypeDisplay.value,
    // };
    // this.tblShamelUpgradeService.list(printRequest).subscribe(
    //   (res: any) =>{
    //     console.log('printRequest', printRequest);
    //     this.rankInput= res.Item1;
    //     console.log('this.rankInput', this.rankInput);
    //   }
    // );
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
  
  clearDataSource(){
    this.dataSource.data= [];
  }

  exportToExcel(){
    this.sanadKidService.export2Excel().subscribe(
      (res) => {
        const file: Blob = new Blob([res], { type: 'application/xlsx' });
        saveAs(file, `?????????? ??????????.xlsx`);
    }
    );
  }

  Delete(sanad: sanad_kid){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: '???? ?????? ????????????', buttonText: { ok: '??????', cancel: '?????????? ??????????' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.sanadKidService.delete(sanad.sanad_kid_seq!).subscribe(res => {
          this.snackBar.open('???? ?????????? ??????????', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        })
      }
    });
  }

  Update(sanad: sanad_kid){
    this.router.navigate(['/sanadKid/module/sanadKidEdit', { id: sanad.sanad_kid_seq }])

  }

  add(){
    this.router.navigate(['/sanadKid/module/sanadKidEdit', { id: 0 }]);
  }



  detail(){

  }

  nextDocs(){

  }


  fromDateChange(changeSource: string){
    if (changeSource == 'day')
      this.fromDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.fromDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.fromDateYearIsFilled= true;

    if (this.fromDateDayIsFilled && this.fromDateMonthIsFilled && this.fromDateYearIsFilled){
      this.sanad_kid_date_from.setValue(moment(this.fromDateMonth+'/'+this.fromDateDay+'/'+this.fromDateYear).set({hour: 2}).toDate());
    }
   }

   toDateChange(changeSource: string){
    if (changeSource == 'day')
      this.toDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.toDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.toDateYearIsFilled= true;

    if (this.toDateDayIsFilled && this.toDateMonthIsFilled && this.toDateYearIsFilled){
      this.sanad_kid_date_to.setValue(moment(this.toDateMonth+'/'+this.toDateDay+'/'+this.toDateYear).set({hour: 2}).toDate());
    }
   }

   
}
