import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { accounts_transactions } from 'src/app/modules/shared/models/accounts_transactions';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { branch } from 'src/app/modules/shared/models/branch';
import { operation_type } from 'src/app/modules/shared/models/operation_type';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { OperationTypeService } from 'src/app/modules/shared/services/operation-type-service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';

@Component({
  selector: 'app-book-seach-list-search',
  templateUrl: './book-seach-list-search.component.html',
  styleUrls: ['./book-seach-list-search.component.css']
})
export class BookSeachListSearchComponent {
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
  operation_type_names!: FormControl<string[] | null>;
  operation_fks!: FormControl<number[] | null>;
  document_id_from!: FormControl<number | null>;
  document_id_to!: FormControl<number | null>;
  document_date_from!: FormControl<Date | null>;
  document_date_to!: FormControl<Date | null>;
  sanad_kid_fk!: FormControl<number | null>;
  incumbent_id_from!: FormControl<number | null>;
  incumbent_id_to!: FormControl<number | null>;
  incumbent_date_from!: FormControl<Date | null>;
  incumbent_date_to!: FormControl<Date | null>;
  book_fk!: FormControl<number | null>;

  account_id_from!: FormControl<number | null>;
  account_id_to!: FormControl<number | null>;
  account_center_id_from!: FormControl<number | null>;
  account_center_id_to!: FormControl<number | null>;
  account_ids!: FormControl<number[] | null>;
  account_center_ids!: FormControl<number[] | null>;
  month_incumbents!: FormControl<number[] | null>;
  month_documents!: FormControl<number[] | null>;
  branch_fk!: FormControl<number | null>;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;




  LoadingFinish: boolean;

  book_list: sanad_kid_book[];

  list_operation_type: operation_type[] = [];
  list_account_center: account_center[] = [];
  list_accounts_tree: accounts_tree[] = [];
  list_branch: branch[] = [];
  list_sanad_kid_book: sanad_kid_book[] = [];

  selected_account_ids: any[] = [];
  selected_account_center_ids: any[] = [];


  _Subscription: Subscription[] = [];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean = false;


  selected_order: accounts_transactions = {};



  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private sanadKidBookService: SanadKidBookService,
    private BranchService: BranchService,
    private OperationTypeService: OperationTypeService,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,


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
          'operation_fks': this.operation_fks = new FormControl<number[]>([], []),
          'operation_type_names': this.operation_type_names = new FormControl<string[]>([], []),
          'document_id_from': this.document_id_from = new FormControl<number | null>(null, []),
          'document_id_to': this.document_id_to = new FormControl<number | null>(null, []),
          'document_date_from': this.document_date_from = new FormControl<Date | null>(null, []),
          'document_date_to': this.document_date_to = new FormControl<Date | null>(null, []),
          'sanad_kid_fk': this.sanad_kid_fk = new FormControl<number | null>(null, []),
          'incumbent_id_from': this.incumbent_id_from = new FormControl<number | null>(null, []),
          'incumbent_id_to': this.incumbent_id_to = new FormControl<number | null>(null, []),
          'incumbent_date_from': this.incumbent_date_from = new FormControl<Date | null>(null, []),
          'incumbent_date_to': this.incumbent_date_to = new FormControl<Date | null>(null, []),
          'account_ids': this.account_ids = new FormControl<number[] | null>([], []),
          'account_center_ids': this.account_center_ids = new FormControl<number[] | null>([], []),

          'book_fk': this.book_fk = new FormControl<number | null>(null, []),

          'account_id_from': this.account_id_from = new FormControl<number | null>(null, []),
          'account_id_to': this.account_id_to = new FormControl<number | null>(null, []),
          'account_center_id_from': this.account_center_id_from = new FormControl<number | null>(null, []),
          'account_center_id_to': this.account_center_id_to = new FormControl<number | null>(null, []),

          'branch_fk': this.branch_fk = new FormControl<number | null>(null, []),

          'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
        }
      );
    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Account_Tree(): Observable<accounts_tree[]> {
    if (this.accountTreeService.List_AccountsTree == null ||
      this.accountTreeService.List_AccountsTree == undefined ||
      this.accountTreeService.List_AccountsTree.length == 0)
      return this.accountTreeService.list_account_tree();
    return of(this.accountTreeService.List_AccountsTree);
  }

  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }
  Load_operation_type(): Observable<operation_type[]> {
    if (this.OperationTypeService.List_operation_type == null ||
      this.OperationTypeService.List_operation_type == undefined ||
      this.OperationTypeService.List_operation_type.length == 0)
      return this.OperationTypeService.list();
    return of(this.OperationTypeService.List_operation_type);
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

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription.push(
      forkJoin(
        this.Load_sanad_kid_book(),
        this.Load_branch(),
        this.Load_operation_type(),
        this.Load_Account_Tree(),
        this.Load_Account_Center(),
      ).subscribe(
        res => {
          this.book_list = res[0];
          this.sanadKidBookService.List_SanadKidBook = this.book_list;
          this.sanadKidBookService.List_SanadKidBook_BehaviorSubject.next(this.sanadKidBookService.List_SanadKidBook);

          this.list_branch = res[1];
          this.BranchService.List_Branch = this.list_branch;
          this.BranchService.List_Branch_BehaviorSubject.next(this.BranchService.List_Branch);

          this.list_operation_type = res[2];
          this.OperationTypeService.List_operation_type = this.list_operation_type;
          this.OperationTypeService.List_operation_type_BehaviorSubject.next(this.list_operation_type);

          this.list_accounts_tree = res[3];
          this.accountTreeService.List_AccountsTree = this.list_accounts_tree;
          this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.list_accounts_tree);

          this.list_account_center = res[4];
          this.account_centerService.List_account_center = this.list_account_center;
          this.account_centerService.List_account_center_BehaviorSubject.next(this.list_account_center);



          this.LoadingFinish = true;

        }
      )
    )

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
console.log(this.selected_account_ids);
console.log(this.selected_account_center_ids);
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


  compare_operation_type_Function(item: any, selected: any) {
    // any logic to compare the objects and return true or false
    return item.operation_type_seq === selected.operation_type_seq
  }

  compare_accounts_tree_Function(item: any, selected: any) {
    // any logic to compare the objects and return true or false
    return item.seq === selected.seq
  }

  compare_account_center_Function(item: any, selected: any) {
    // any logic to compare the objects and return true or false
    return item.account_center_seq === selected.account_center_seq
  }

}
