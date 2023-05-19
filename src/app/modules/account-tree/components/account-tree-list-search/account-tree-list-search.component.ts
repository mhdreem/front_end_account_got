import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, UntypedFormBuilder, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable, forkJoin, of, startWith, map, switchMap } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { account_group } from 'src/app/modules/shared/models/account_group';
import { account_level } from 'src/app/modules/shared/models/account_level';
import { account_type } from 'src/app/modules/shared/models/account_type';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { branch } from 'src/app/modules/shared/models/branch';
import { finance_list } from 'src/app/modules/shared/models/finance_list';
import { sub_financial_list } from 'src/app/modules/shared/models/sub_financial_list';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import { SubFinancialListService } from 'src/app/modules/shared/services/sub_financial_list.service';
import { AccountClassification } from 'src/app/modules/shared/models/account-classification';
import { AccountclassificationService } from 'src/app/modules/shared/services/account-classification.service';

@Component({
  selector: 'app-account-tree-list-search',
  templateUrl: './account-tree-list-search.component.html',
  styleUrls: ['./account-tree-list-search.component.scss']
})
export class AccountTreeListSearchComponent implements OnInit, OnDestroy {

  @Input() Title:string = "عرض خيارات البحث";
  @Output() OnSeachCommandExecute : EventEmitter<any> = new EventEmitter();


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
  }

  
  LoadingFinish : boolean = true ;

 
 
 
  _Subscriptions: Subscription[] = [] ;

  Form!: FormGroup;
  account_id_from!: FormControl<number | null>;
  account_id_to!: FormControl<number | null>;
  account_name!: FormControl<string | null>;
  account_type_fk!: FormControl<number | null>;
  account_level_fk!: FormControl<number | null>;
  account_group_fk!: FormControl<number | null>;
  account_class_fk!: FormControl<number | null>;
  account_classification_fk!: FormControl<number | null>;
  finance_list_fk!: FormControl<number | null>;
  sub_financial_list_fk!: FormControl<number | null>;

  branch_fk : FormControl;
  page_index!: FormControl<number | null>;
  row_count!: FormControl<number | null>;


  // Filtering
  accountType_List: account_type[] = [];
  filteredAccountTypeOptions!: Observable<account_type[]>;
  accountLevel_List: account_level[] = [];
  filteredAccountLevelOptions!: Observable<account_level[]>;
  accountGroup_List: account_group[] = [];
  filteredAccountGroupOptions!: Observable<account_group[]>;
  accountClass_List: account_class[] = [];
  filteredAccountClassOptions!: Observable<account_class[]>;
  accountClassification_List: AccountClassification[] = [];
  filteredAccountClassificationOptions!: Observable<AccountClassification[]>;
  financeList_List: finance_list[] = [];
  filteredfinanceListOptions!: Observable<finance_list[]>;
  branch_List: branch[] = [];
  filteredBranchOptions!: Observable<branch[]>;
  account_type_List:account_type[]=[];
  sub_financial_list_list:sub_financial_list[]=[];
  isLoading = false;

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  


  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private accountTypeService: account_typeService,
    private SubFinancialListService:SubFinancialListService,
   
    private accountLevelService: AccountLevelService,
    private accountGroupService: AccountGroupService,
    private accountClassService: AccountClassService,
    private accountclassificationService: AccountclassificationService,
    private financeListService: FinanceListService,
    private accountTreeService: AccountTreeService,
    private branchService: BranchService,
    private router: Router
  
    ) {
    this.LoadingFinish = true;

      this.BuildForm();
      this.Load_Data();

     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'account_id_from': this.account_id_from = new FormControl<number | null>(null, []),
            'account_id_to': this.account_id_to = new FormControl<number | null>(null, []),
            'account_name': this.account_name = new FormControl<string | null>(null, []),
            'account_type_fk': this.account_type_fk = new FormControl<number | null>(null, []),
            'account_level_fk': this.account_level_fk = new FormControl<number | null>(null, []),
            'account_group_fk': this.account_group_fk = new FormControl<number | null>(null, []),
            'account_class_fk': this.account_class_fk = new FormControl<number | null>(null, []),
            'account_classification_fk': this.account_classification_fk = new FormControl<number | null>(null, []),
            'finance_list_fk': this.finance_list_fk = new FormControl<number | null>(null, []),
            
            'sub_financial_list_fk': this.sub_financial_list_fk = new FormControl<number | null>(null, []),

          

            'branch_fk': this.branch_fk = new FormControl<number | null>(null, [Validators.required]),
            'page_index': this.page_index = new FormControl<number | null>(null, []),
          'row_count': this.row_count = new FormControl<number | null>(null, []),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
    Load_SubFinancialList() {
      if (this.SubFinancialListService.List_sub_financial_list == null ||
        this.SubFinancialListService.List_sub_financial_list == undefined ||
        this.SubFinancialListService.List_sub_financial_list.length == 0)
        return this.SubFinancialListService.list();
      return of(this.SubFinancialListService.List_sub_financial_list);
  
    }
  

    Load_Data() {
    this.LoadingFinish = false;
      
      var Subscription = forkJoin(
        this.Load_AccountType(),
        this.Load_AccountLevel(),
        this.Load_AccountGroup(),
        this.Load_AccountClass(),
        this.Load_AccountClassification(),
        this.Load_FinanceList(),
        this.Load_Branch(),
        this.Load_SubFinancialList()
      ).subscribe(
        res => {
          this.accountType_List = res[0];
          this.filteredAccountTypeOptions = of(this.accountType_List);
          this.accountTypeService.List_account_type = this.accountType_List;
          this.accountTypeService.List_account_type_BehaviorSubject.next(this.accountType_List);

          this.accountLevel_List = res[1];
          this.filteredAccountLevelOptions = of(this.accountLevel_List);
          this.accountLevelService.List_AccountLevel = this.accountLevel_List;
          this.accountLevelService.List_AccountLevel_BehaviorSubject.next(this.accountLevel_List);
  
          this.accountGroup_List = res[2];
          this.filteredAccountGroupOptions = of(this.accountGroup_List);
          this.accountGroupService.List_AccountGroup = this.accountGroup_List;
          this.accountGroupService.List_AccountGroup_BehaviorSubject.next(this.accountGroup_List);
  
          this.accountClass_List = res[3];
          this.filteredAccountClassOptions = of(this.accountClass_List);
          this.accountClassService.List_AccountClass = this.accountClass_List;
          this.accountClassService.List_AccountClass_BehaviorSubject.next(this.accountClass_List);
          
          this.accountClassification_List = res[4];
          this.filteredAccountClassificationOptions = of(this.accountClassification_List);
          this.accountclassificationService.List_Accountclassification = this.accountClassification_List;
          this.accountclassificationService.List_Accountclassification_BehaviorSubject.next(this.accountClassification_List);
  
          this.financeList_List = res[5];
          this.filteredfinanceListOptions = of(this.financeList_List);
          this.financeListService.List_FinanceList = this.financeList_List;
          this.financeListService.List_FinanceList_BehaviorSubject.next(this.financeList_List);
  
          this.branch_List = res[6];
          this.filteredBranchOptions = of(this.branch_List);
          this.branchService.List_Branch = this.branch_List;
          this.branchService.List_Branch_BehaviorSubject.next(this.branch_List);

  
          this.sub_financial_list_list = res[7];
          
          this.SubFinancialListService.List_sub_financial_list = this.sub_financial_list_list;
          this.SubFinancialListService.List_sub_financial_list_BehaviorSubject.next(this.sub_financial_list_list);

          this.LoadingFinish = true;

          
        }
        
      );
      this._Subscriptions.push(Subscription);
    }
  
    Load_AccountType(){
      if (this.accountTypeService.List_account_type == null ||
        this.accountTypeService.List_account_type == undefined ||
        this.accountTypeService.List_account_type.length == 0)
        return this.accountTypeService.list();
      return of(this.accountTypeService.List_account_type);
    }

    Load_AccountLevel(){
      if (this.accountLevelService.List_AccountLevel == null ||
        this.accountLevelService.List_AccountLevel == undefined ||
        this.accountLevelService.List_AccountLevel.length == 0)
        return this.accountLevelService.list();
      return of(this.accountLevelService.List_AccountLevel);
    }
  
    Load_AccountGroup(){
      if (this.accountGroupService.List_AccountGroup == null ||
        this.accountGroupService.List_AccountGroup == undefined ||
        this.accountGroupService.List_AccountGroup.length == 0)
        return this.accountGroupService.list();
      return of(this.accountGroupService.List_AccountGroup);
    }
  
    Load_AccountClass(){
      if (this.accountClassService.List_AccountClass == null ||
        this.accountClassService.List_AccountClass == undefined ||
        this.accountClassService.List_AccountClass.length == 0)
        return this.accountClassService.list();
      return of(this.accountClassService.List_AccountClass);
    }
    
    Load_AccountClassification(){
      if (this.accountclassificationService.List_Accountclassification == null ||
        this.accountclassificationService.List_Accountclassification == undefined ||
        this.accountclassificationService.List_Accountclassification.length == 0)
        return this.accountclassificationService.list();
      return of(this.accountclassificationService.List_Accountclassification);
    }
  
    Load_FinanceList(){
      if (this.financeListService.List_FinanceList == null ||
        this.financeListService.List_FinanceList == undefined ||
        this.financeListService.List_FinanceList.length == 0)
        return this.financeListService.list();
      return of(this.financeListService.List_FinanceList);
    }

    Load_Branch(){
      if (this.branchService.List_Branch == null ||
        this.branchService.List_Branch == undefined ||
        this.branchService.List_Branch.length == 0)
        return this.branchService.list();
      return of(this.branchService.List_Branch);
    }
  
    
  /*
    public async Init_AutoComplete() {
      try {
        this.filteredAccountTypeOptions = this.account_type_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccountType(value) : this.accountType_List.slice())
          );
  
        this.filteredAccountLevelOptions = this.account_level_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccountLevel(value) : this.accountLevel_List.slice())
          );
  
        this.filteredAccountGroupOptions = this.account_group_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccountGroup(value) : this.accountGroup_List.slice())
          );
  
        this.filteredAccountClassOptions = this.account_class_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccountClass(value) : this.accountClass_List.slice())
          );
  
        this.filteredfinanceListOptions = this.finance_list_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterFinanceList(value) : this.financeList_List.slice())
          );
  
          this.filteredBranchOptions = this.branch_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterBranch(value) : this.branch_List.slice())
          );
  
      } catch (Exception: any) { console.log(Exception);}
    }
  

    private _filterAccountType(value: string): account_type[] {
      const filterValue = value.toLowerCase();
  
      return this.accountType_List.filter(option => option.account_type_seq == +filterValue);
    }
    
    private _filterAccountLevel(value: string): account_level[] {
      const filterValue = value.toLowerCase();
  
      return this.accountLevel_List.filter(option => option.account_level_seq == +filterValue);
    }
    
    private _filterAccountGroup(value: string): account_group[] {
      const filterValue = value.toLowerCase();
  
      return this.accountGroup_List.filter(option => option.account_group_seq == +filterValue);
    }
    
    private _filterAccountClass(value: string): account_class[] {
      const filterValue = value.toLowerCase();
  
      return this.accountClass_List.filter(option => option.account_class_seq == +filterValue);
    }
    
    private _filterFinanceList(value: string): finance_list[] {
      const filterValue = value.toLowerCase();
  
      return this.financeList_List.filter(option => option.finance_list_seq == +filterValue);
    }
    
    private _filterBranch(value: string): branch[] {
      const filterValue = value.toLowerCase();
  
      return this.branch_List.filter(option => option.branch_seq == +filterValue);
    }
  
    public displayAccountTypeProperty(value: string): string {
      if (value && this.accountType_List) {
        let cer: any = this.accountType_List.find(cer => cer.account_type_seq!.toString() == value);
        if (cer)
          return cer.account_type_name;
      }
      return '';
    }
  
    public displayAccountLevelProperty(value: string): string {
      if (value && this.accountLevel_List) {
        let cer: any = this.accountLevel_List.find(cer => cer.account_level_seq!.toString() == value);
        if (cer)
          return cer.account_level_name;
      }
      return '';
    }
  
    public displayAccountGroupProperty(value: string): string {
      if (value && this.accountGroup_List) {
        let cer: any = this.accountGroup_List.find(cer => cer.account_group_seq!.toString() == value);
        if (cer)
          return cer.account_group_name;
      }
      return '';
    }

    public displayAccountClassProperty(value: string): string {
      if (value && this.accountClass_List) {
        let cer: any = this.accountClass_List.find(cer => cer.account_class_seq!.toString() == value);
        if (cer)
          return cer.account_class_name;
      }
      return '';
    }

    public displayFinanceListProperty(value: string): string {
      if (value && this.financeList_List) {
        let cer: any = this.financeList_List.find(cer => cer.finance_list_seq!.toString() == value);
        if (cer)
          return cer.finance_list_name;
      }
      return '';
    }
  
    public displayBranchProperty(value: string): string {
      if (value && this.branch_List) {
        let cer: any = this.branch_List.find(cer => cer.branch_seq!.toString() == value);
        if (cer)
          return cer.branch_name;
      }
      return '';
    }

   */
  

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy(): void {
    if (this._Subscriptions!= null && this._Subscriptions.length>0)

    this._Subscriptions.forEach(Sub => {
      Sub.unsubscribe();      
    });
  }


  ClearForm()
  {
    this.Form.reset();
    let element = this._document.getElementById('account_id_from');
    if (element) {
      element.focus();
    }
  }
  
  OnSeachBtnClick(){  
    this.page_index.setValue(this.currentPage);
    this.row_count.setValue(this.pageSize);   
    this.OnSeachCommandExecute.emit(this.Form.value);
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  openBasicModal(content: TemplateRef<any>) {
    this.modalService.open(content, { windowClass: 'sidepanel sidepanel-fade', size: 'side-70', backdropClass: 'light-blue-backdrop' }).result.then((Result) => {

      if (Result == 1) {
        this.OnSeachBtnClick();      
      }
      else
        this.OnSeachCommandExecute.emit({});
    }).catch(() => {

    });
  }

 
 
}



