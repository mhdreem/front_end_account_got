import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '@coreui/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import { Observable, Subscription, startWith, switchMap, forkJoin, of, map } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { branch } from 'src/app/modules/shared/models/branch';
import { exchange_order } from 'src/app/modules/shared/models/exchange_order';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { ExchangeOrderService } from 'src/app/modules/shared/services/exchange-order.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';

@Component({
  selector: 'app-exchange-order-list-search',
  templateUrl: './exchange-order-list-search.component.html',
  styleUrls: ['./exchange-order-list-search.component.scss']
})
export class ExchangeOrderListSearchComponent {

  @Input() Title: string = '';
  @Output() OnSeachCommandExecute: EventEmitter<any> = new EventEmitter<any>();


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 123) {
      event.preventDefault();

    }
    if (event.keyCode == 119) {
      event.preventDefault();
      this.onViewClick();
    }

  }

  fromSanadDateDay: string = '';
  fromSanadDateMonth: string = '';
  fromSanadDateYear: string = '';
  toSanadDateDay: string = '';
  toSanadDateMonth: string = '';
  toSanadDateYear: string = '';

  fromSanadDateDayIsFilled: boolean = false;
  fromSanadDateMonthIsFilled: boolean = false;
  fromSanadDateYearIsFilled: boolean = false;
  toSanadDateDayIsFilled: boolean = false;
  toSanadDateMonthIsFilled: boolean = false;
  toSanadDateYearIsFilled: boolean = false;

  fromIncumbentDateDay: string = '';
  fromIncumbentDateMonth: string = '';
  fromIncumbentDateYear: string = '';
  toIncumbentDateDay: string = '';
  toIncumbentDateMonth: string = '';
  toIncumbentDateYear: string = '';

  fromIncumbentDateDayIsFilled: boolean = false;
  fromIncumbentDateMonthIsFilled: boolean = false;
  fromIncumbentDateYearIsFilled: boolean = false;
  toIncumbentDateDayIsFilled: boolean = false;
  toIncumbentDateMonthIsFilled: boolean = false;
  toIncumbentDateYearIsFilled: boolean = false;

  Form!: FormGroup;
  document_id_from!: FormControl<number | null>;
  document_id_to!: FormControl<number | null>;
  document_date_from!: FormControl<Date | null>;
  document_date_to!: FormControl<Date | null>;
  sanad_kid_fk!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;
  exchange_order_type_fk!: FormControl<number | null>;
  book_fk!: FormControl<number | null>;
  attachement_id!: FormControl<number | null>;
  ownership!: FormControl<string | null>;
  source_number!: FormControl<string | null>;
  name_of_owner!: FormControl<string | null>;
  branch_fk!: FormControl<number | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;



  List_Type_Sanad: any[] = [
    { value: 1, name: 'كامل' },
    { value: 2, name: 'مسودة' },
    { value: undefined, name: 'الجميع' },
  ]

  LoadingFinish: boolean;

  book_list: sanad_kid_book[];
  book_filter: Observable<sanad_kid_book[]>;
  list_attachement_type: attachement_type[] = [];
  branch_list: branch[];
  branch_filter: Observable<branch[]>;

  _Subscription : Subscription[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = false;


  selected_order: exchange_order = {};



  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidBookService: SanadKidBookService,
    private BranchService: BranchService,
    private AttachmentTypeService: AttachmentTypeService,
  ) {
    this.LoadingFinish = true;
    this.BuildForm();
    this.Load_Data();
  }

  ngOnInit(): void {

  }


  ngOnDestroy() {
    this._Subscription.forEach(Sub => {
      if (Sub != null) Sub.unsubscribe();
    });
  }


  ngAfterViewInit() {

  }


  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'document_id_from': this.document_id_from = new FormControl<number | null>(null, []),
          'document_id_to': this.document_id_to = new FormControl<number | null>(null, []),
          'document_date_from': this.document_date_from = new FormControl<Date | null>(null, []),
          'document_date_to': this.document_date_to = new FormControl<Date | null>(null, []),
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
          'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
          'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
          'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),
          'exchange_order_type_fk': this.exchange_order_type_fk = new FormControl<number | null>(null, []),
          'book_fk': this.book_fk = new FormControl<number | null>(null, []),
          'name_of_owner': this.name_of_owner = new FormControl<string | null>(null, []),
          'attachement_id': this.attachement_id = new FormControl<number | null>(null, []),
          'ownership': this.ownership = new FormControl<string | null>(null, []),
          'source_number': this.source_number = new FormControl<string | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'type_fk': this.branch_fk = new FormControl<number | null>(null, []),
          'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
        }
      );
    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription.push(
      forkJoin(
        this.Load_sanad_kid_book(),
        this.Load_branch(),
        this.Load_attachement_type()
      ).subscribe(
        res => {
          this.book_list = res[0];
          this.book_filter = of(this.book_list);
          this.sanadKidBookService.List_SanadKidBook = this.book_list;
          this.sanadKidBookService.List_SanadKidBook_BehaviorSubject.next(this.sanadKidBookService.List_SanadKidBook);
  
          this.branch_list = res[1];
          this.branch_filter = of(this.branch_list);
          this.BranchService.List_Branch = this.branch_list;
          this.BranchService.List_Branch_BehaviorSubject.next(this.BranchService.List_Branch);
  
          this.list_attachement_type = res[2];
          this.AttachmentTypeService.List_attachment_type = this.list_attachement_type;
          this.AttachmentTypeService.List_attachment_type_BehaviorSubject.next(this.list_attachement_type);
  
  
  
          //    this.Init_AutoComplete();
  
          this.LoadingFinish = true;
  
        }
      )
    )  
    
  }



  Load_attachement_type(): Observable<attachement_type[]> {
    if (this.AttachmentTypeService.List_attachment_type == null ||
      this.AttachmentTypeService.List_attachment_type == undefined ||
      this.AttachmentTypeService.List_attachment_type.length == 0)
      return this.AttachmentTypeService.list();
    return of(this.AttachmentTypeService.List_attachment_type);
  }




  Load_sanad_kid_book(): Observable<sanad_kid_book[]> {
    if (this.sanadKidBookService.List_SanadKidBook == null ||
      this.sanadKidBookService.List_SanadKidBook == undefined ||
      this.sanadKidBookService.List_SanadKidBook.length == 0)
      return this.sanadKidBookService.list();
    return of(this.sanadKidBookService.List_SanadKidBook);
  }

  Load_branch(): Observable<branch[]> {
    if (this.BranchService.List_Branch == null ||
      this.BranchService.List_Branch == undefined ||
      this.BranchService.List_Branch.length == 0)
      return this.BranchService.list();
    return of(this.BranchService.List_Branch);
  }


  public async Init_AutoComplete() {
    try {

      this.book_filter = this.book_fk.valueChanges
        .pipe(
          startWith(''),
          map((value) => value && typeof value === 'string' ? this._filter_book(value) : this.book_list.slice())
        );

      this.branch_filter = this.branch_fk.valueChanges
        .pipe(
          startWith(''),
          map((value) => value && typeof value === 'string' ? this._filter_branch(value) : this.branch_list.slice())
        );


    } catch (Exception: any) { }
  }


  private _filter_book(value: string): sanad_kid_book[] {
    const filterValue = value.toLowerCase();
    return this.book_list.filter(option => option.sanad_kid_book_name != null && option.sanad_kid_book_name.includes(filterValue));
  }


  private _filter_branch(value: string): branch[] {
    return this.branch_list.filter(option => option.branch_name != null && option.branch_name.includes(value));
  }


  public display_Book_Property(value: number): string {
    if (value != null) {
      var books = this.book_list.filter(x => x.sanad_kid_book_seq == value);
      if (books != null && books.length > 0 && books[0].sanad_kid_book_name != null) {

        return books[0].sanad_kid_book_name;
      }

      return '';
    }
    return '';
  }




  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element != null && element.tagName != null && element.tagName.toLowerCase() == 'ng-select') {
      var elements = element?.firstElementChild?.firstElementChild?.lastElementChild?.getElementsByTagName('input');
      if (elements != null && elements.length > 0) {
        var inputSearchElement = elements.item(0);
        if (inputSearchElement != null) {
          inputSearchElement.focus();
        }

      }

    } else if (element) {
      element.focus();
    }
  }




  fromSanadDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.fromSanadDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.fromSanadDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.fromSanadDateYearIsFilled = true;

    if (this.fromSanadDateDayIsFilled && this.fromSanadDateMonthIsFilled && this.fromSanadDateYearIsFilled) {
      this.document_date_from.setValue(moment(this.fromSanadDateMonth + '/' + this.fromSanadDateDay + '/' + this.fromSanadDateYear).set({ hour: 2 }).toDate());
    }
  }

  toSanadDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.toSanadDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.toSanadDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.toSanadDateYearIsFilled = true;

    if (this.toSanadDateDayIsFilled && this.toSanadDateMonthIsFilled && this.toSanadDateYearIsFilled) {
      this.document_date_to.setValue(moment(this.toSanadDateMonth + '/' + this.toSanadDateDay + '/' + this.toSanadDateYear).set({ hour: 2 }).toDate());
    }
  }

  fromIncumbentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.fromIncumbentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.fromIncumbentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.fromIncumbentDateYearIsFilled = true;

    if (this.fromIncumbentDateDayIsFilled && this.fromIncumbentDateMonthIsFilled && this.fromIncumbentDateYearIsFilled) {
      this.incumbent_date_from.setValue(moment(this.fromIncumbentDateMonth + '/' + this.fromIncumbentDateDay + '/' + this.fromIncumbentDateYear).set({ hour: 2 }).toDate());
    }
  }

  toIncumbentDateChange(changeSource: string) {
    if (changeSource == 'day')
      this.toIncumbentDateDayIsFilled = true;
    else if (changeSource == 'month')
      this.toIncumbentDateMonthIsFilled = true;
    else if (changeSource == 'year')
      this.toIncumbentDateYearIsFilled = true;

    if (this.toIncumbentDateDayIsFilled && this.toIncumbentDateMonthIsFilled && this.toIncumbentDateYearIsFilled) {
      this.incumbent_date_to.setValue(moment(this.toIncumbentDateMonth + '/' + this.toIncumbentDateDay + '/' + this.toIncumbentDateYear).set({ hour: 2 }).toDate());
    }
  }



  select_Book_Option(event: any) {

    const selectedValue = event.option.value;

    if (selectedValue != null) {

      var books = this.book_list.filter(x => x.sanad_kid_book_seq == selectedValue);
      if (books != null && books.length > 0 && books[0].branch_fk != null) {
        this.branch_fk.setValue(books[0].branch_fk);
      }

    }

  }





  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-70', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {

      if (Result == 1) {
        this.currentPage = 0;
        this.pageSize = 5;
        this.page_index.setValue(this.currentPage);
        this.row_count.setValue(this.pageSize);
        this.OnSeachCommandExecute.emit(this.Form.value);
      }
      else
        this.OnSeachCommandExecute.emit({});


    }).catch(() => {

    });
  }

  public onViewClick() {
    this.currentPage = 0;
    this.pageSize = 5;
    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);
    this.OnSeachCommandExecute.emit(this.Form.value);
  }



}
