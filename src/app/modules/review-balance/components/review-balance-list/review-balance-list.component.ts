import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { result } from 'src/app/modules/shared/models/result';
import { ReviewBalanceService } from 'src/app/modules/shared/services/review-balance.service';

@Component({
  selector: 'app-review-balance-list',
  templateUrl: './review-balance-list.component.html',
  styleUrls: ['./review-balance-list.component.scss']
}) 
export class ReviewBalanceListComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 119) {
      event.preventDefault();
      this.View();
    }
    if (event.keyCode == 118) {
      event.preventDefault();
      this.exportToExcel();
    }

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  all_columns: string[]= [];
  displayedColumns: string[] =
    ['document_id', 'incumbent_date', 'document_id','account_center_name',  'document_date', 'account_center_name', 'operation_type', 'sanad_kid_book_name'];
  dataSourceIsEmpty: boolean= true;
  Form!: FormGroup;
  incumbent_month!: FormControl<number[] | null>;
  sanad_month!: FormControl<number[] | null>;

  isLoading: boolean= false;

  pageSizeOptions: number[] = [5, 10, 25, 100];


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private reviewBalanceService: ReviewBalanceService
  ) {
    this.BuildForm();


  }

  ngOnInit(): void {
 
  }
      
      
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'incumbent_month': this.incumbent_month = new FormControl<number[] | null>(null, []),
          'sanad_month': this.sanad_month = new FormControl<number[] | null>(null, []),
        }
      );


    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  
  View() {
    this.isLoading= true;

    return this.reviewBalanceService.search(this.Form.value).subscribe((data: result)=>{
      this.isLoading= false;
      if (data!= null && data.value!= null)
      {
        this.dataSource.data  = data.value;
        if (data.value.length != 0)
          this.dataSourceIsEmpty= false;
      }else
      {
        this.dataSource.data = [];
      }

     
      
    });


  }

  

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  clearDataSource() {
    this.dataSource.data = [];
  }

  exportToExcel() {

  }

  updateColumns(){
    
  }

}
