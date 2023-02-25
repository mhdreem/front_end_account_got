import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { account_group } from 'src/app/modules/shared/models/account_group';
import { account_level } from 'src/app/modules/shared/models/account_level';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { account_type } from 'src/app/modules/shared/models/account_type';
import { finance_list } from 'src/app/modules/shared/models/finance_list';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import { AccountTreeEditComponent } from '../account-tree-edit/account-tree-edit.component';
import { branch } from 'src/app/modules/shared/models/branch';
import { BranchService } from 'src/app/modules/shared/services/branch.service';

@Component({
  selector: 'app-account-tree-list',
  templateUrl: './account-tree-list.component.html',
  styleUrls: ['./account-tree-list.component.scss']
})
export class AccountTreeListComponent implements OnInit, OnDestroy {

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

  // formname:string = 'عرض بيانات الترفيع';
  LoadingFinish : boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<accounts_tree>();
  displayedColumns: string[] = [
    'Year_ID', 'action' ];

  _Subscription!: Subscription;

  Form!: FormGroup;
  account_id_from!: FormControl<number | null>;
  account_id_to!: FormControl<number | null>;
  account_name!: FormControl<string | null>;
  account_type_fk!: FormControl<number | null>;
  account_level_fk!: FormControl<number | null>;
  account_group_fk!: FormControl<number | null>;
  account_class_fk!: FormControl<number | null>;
  finance_list_fk!: FormControl<number | null>;
  branch_fk : FormControl;


  // Filtering
  accountType_List: account_type[] = [];
  filteredAccountTypeOptions!: Observable<account_type[]>;
  accountLevel_List: account_level[] = [];
  filteredAccountLevelOptions!: Observable<account_level[]>;
  accountGroup_List: account_group[] = [];
  filteredAccountGroupOptions!: Observable<account_group[]>;
  accountClass_List: account_class[] = [];
  filteredAccountClassOptions!: Observable<account_class[]>;
  financeList_List: finance_list[] = [];
  filteredfinanceListOptions!: Observable<finance_list[]>;
  branch_List: branch[] = [];
  filteredBranchOptions!: Observable<branch[]>;

  isLoading = false;

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  treeDataSource = new MatTreeNestedDataSource<accounts_tree>();
  treeControl = new NestedTreeControl<accounts_tree>(node => node.children);
  hasChild = (_: number, node: accounts_tree) => !!node.children && node.children.length > 0;
  // darkTheme: boolean;


  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private accountTypeService: account_typeService,
    private accountLevelService: AccountLevelService,
    private accountGroupService: AccountGroupService,
    private accountClassService: AccountClassService,
    private financeListService: FinanceListService,
    private accountTreeService: AccountTreeService,
    private branchService: BranchService
    // private themeService: ThemeService
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
            'finance_list_fk': this.finance_list_fk = new FormControl<number | null>(null, []),
            'branch_fk': this.branch_fk = new FormControl<number | null>(null, [Validators.required]),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
    Load_Data() {
    this.LoadingFinish = false;
      
      this._Subscription = forkJoin(
        this.Load_AccountType(),
        this.Load_AccountLevel(),
        this.Load_AccountGroup(),
        this.Load_AccountClass(),
        this.Load_FinanceList(),
        this.Load_Branch(),
        this.BuildTree()
        
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
  
          this.financeList_List = res[4];
          this.filteredfinanceListOptions = of(this.financeList_List);
          this.financeListService.List_FinanceList = this.financeList_List;
          this.financeListService.List_FinanceList_BehaviorSubject.next(this.financeList_List);
  
          this.branch_List = res[5];
          this.filteredBranchOptions = of(this.branch_List);
          this.branchService.List_Branch = this.branch_List;
          this.branchService.List_Branch_BehaviorSubject.next(this.branch_List);

          this.treeDataSource.data = [res[6]];
  
          this.Init_AutoComplete();
  
          this.LoadingFinish = true;

          
        }
        
      )
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
  
    BuildTree(): Observable<accounts_tree> {
      return this.accountTreeService.BuildTree();
    }
  
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
  
      } catch (Exception: any) { }
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

   

  ngOnInit(): void {
    // this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
    //   this.darkTheme= res;
    // })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  rowClicked!: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  View(){
    this.accountTreeService.search(this.Form.value).subscribe(
      (res: any) =>{
        this.dataSource.paginator= this.paginator;
        this.dataSource.data = res;
      }
    );

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

  }

  Delete(account: accounts_tree){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: { message: 'هل أنت متأكد؟', buttonText: { ok: 'نعم', cancel: 'الغاء الأمر' } },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == 1) {
        this.accountTreeService.delete(account.seq!).subscribe(res => {
          this.snackBar.open('تم الحذف بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        })
      }
    });
  }

  Update(account: accounts_tree){
    const dialogRef = this.dialog.open(AccountTreeEditComponent, {
      position: {top: "8%" },
      data: { action: 'update', account: account },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        //update table
        this.View();

      }
    });
  }

  add(){
    const dialogRef = this.dialog.open(AccountTreeEditComponent, {
      position: {top: "8%", left: "3%"},
      width: "1150px",
      data: { action: 'add', account: {} },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        //update table
        this.View();
      }
    });
  }

  addAccount(ParentNode: accounts_tree) {

    const dialogRef = this.dialog.open(AccountTreeEditComponent, {
      position: {top: "8%" , left: "3%"},
      width: "1150px",
      data: {action: 'add', account: ParentNode },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        //update tree
        this._Subscription.add(
          this.BuildTree().subscribe(res => {
            this.treeDataSource.data = [res];
          })
        );
        //update table
        this.View();
      }
    })
  }
}



