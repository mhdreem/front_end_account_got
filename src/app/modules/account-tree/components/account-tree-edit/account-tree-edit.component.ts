import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, forkJoin, map, Observable, of, retry, startWith, Subscription } from 'rxjs';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { account_final } from 'src/app/modules/shared/models/account_final';
import { account_group } from 'src/app/modules/shared/models/account_group';
import { account_level } from 'src/app/modules/shared/models/account_level';
import { branch } from 'src/app/modules/shared/models/branch';
import { finance_list } from 'src/app/modules/shared/models/finance_list';
import { result } from 'src/app/modules/shared/models/result';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountFinalService } from 'src/app/modules/shared/services/account-final.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountId } from './Validators/validateAccountId';
import { validateAccountName } from './Validators/validateAccountName';
import { PageTreeServiceService } from '../page_service/page-tree-service.service';
import { ReturnStatement } from '@angular/compiler';
import { sub_financial_list } from 'src/app/modules/shared/models/sub_financial_list';
import { account_type } from 'src/app/modules/shared/models/account_type';
import { SubFinancialListService } from 'src/app/modules/shared/services/sub_financial_list.service';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';

interface extende_accounts_tree extends accounts_tree {
  expandable?: boolean
}

@Component({
  selector: 'app-account-tree-edit',
  templateUrl: './account-tree-edit.component.html',
  styleUrls: ['./account-tree-edit.component.scss']
})

export class AccountTreeEditComponent implements OnInit, OnDestroy {

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 120) {
      event.preventDefault();
      this.save();
    }

  }

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  _Subscriptions: Subscription[] = [];

  Form!: FormGroup;
  seq!: FormControl<number | undefined | null>;
  account_parent_seq!: FormControl<number | undefined | null>;
  account_id!: FormControl<string | undefined | null>;
  account_name!: FormControl<string | undefined | null>;
  account_level_fk!: FormControl<number | undefined | null>;
  account_group_fk!: FormControl<number | undefined | null>;
  account_class_fk!: FormControl<number | undefined | null>;
  finance_list_fk!: FormControl<number | undefined | null>;
  sub_financial_list_fk!: FormControl<number | undefined | null>;
  account_type_fk!: FormControl<number | undefined | null>;
  account_final_fk!: FormControl<number | undefined | null>;
  phone!: FormControl<number | undefined | null>;
  mobil!: FormControl<number | undefined | null>;
  fax!: FormControl<number | undefined | null>;
  address!: FormControl<string | undefined | null>;
  notice!: FormControl<string | undefined | null>;
  account_center_fk!: FormControl<number | null>;
  account_center!: FormControl<account_center | null>;
  branch_fk: FormControl;


  sub_financial_list_list: sub_financial_list[] = [];
  filtered_sub_financial_list_list!: Observable<sub_financial_list[]>;
  account_type_list: account_type[] = [];
  filtered_account_type_list!: Observable<account_type[]>;


  accountLevel_List: account_level[] = [];
  filteredAccountLevelOptions!: Observable<account_level[]>;
  accountGroup_List: account_group[] = [];
  filteredAccountGroupOptions!: Observable<account_group[]>;
  accountClass_List: account_class[] = [];
  filteredAccountClassOptions!: Observable<account_class[]>;
  financeList_List: finance_list[] = [];
  filteredfinanceListOptions!: Observable<finance_list[]>;
  accountFinal_List: account_final[] = [];
  filteredAccountFinalOptions!: Observable<account_final[]>;
  parentAccountName_List: extende_accounts_tree[] = [];
  filteredparentAccountNameOptions!: Observable<extende_accounts_tree[]>;
  account_center_list: account_center[];
  account_center_filter: Observable<account_center[]>;
  branch_List: branch[] = [];
  filteredBranchOptions!: Observable<branch[]>;

  selected_Account: extende_accounts_tree = {};

  LoadingFinish: boolean;

  // route parameter


  treeDataSource = new MatTreeNestedDataSource<extende_accounts_tree>();
  treeControl = new NestedTreeControl<extende_accounts_tree>(node => node.children);
  isExpandable = (node: extende_accounts_tree) => node.expandable;

  hasChild = (_: number, node: extende_accounts_tree) => !!node.children && node.children.length > 0;

  constructor(
    private PageTreeServiceService: PageTreeServiceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private SubFinancialListService: SubFinancialListService,
    private account_typeService: account_typeService,
    public route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private accountLevelService: AccountLevelService,
    private accountGroupService: AccountGroupService,
    private accountClassService: AccountClassService,
    private financeListService: FinanceListService,
    private accountFinalService: AccountFinalService,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService,
    private branchService: BranchService,
    private formValidatorsService: FormValidationHelpersService) {

    this.LoadingFinish = true;

    this.BuildForm();
    this.Load_Data();

    this._Subscriptions.push(
      this.PageTreeServiceService.$account_tree.subscribe(res => {
        this.selected_Account = res;
        this.Form.reset();

        this.Form.patchValue(this.selected_Account);

        this.SetValue();

      })
    );



  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'seq': this.seq = new FormControl<number | undefined>(undefined, []),
          'account_parent_seq': this.account_parent_seq = new FormControl<number | undefined>(undefined, []),
          'account_id': this.account_id = new FormControl<string | undefined>(undefined, [Validators.required,Validators.maxLength(7)]),
          'account_name': this.account_name = new FormControl<string | undefined>(undefined, [Validators.required]),
          'account_level_fk': this.account_level_fk = new FormControl<number | undefined>({ value: undefined, disabled: true }, []),
          'account_group_fk': this.account_group_fk = new FormControl<number | undefined>({ value: undefined, disabled: true }, []),
          'account_class_fk': this.account_class_fk = new FormControl<number | undefined>({ value: undefined, disabled: true }, []),
          'finance_list_fk': this.finance_list_fk = new FormControl<number | undefined>(undefined, []),
          'sub_financial_list_fk': this.sub_financial_list_fk = new FormControl<number | undefined>(undefined, []),
          'account_type_fk': this.account_type_fk = new FormControl<number | undefined>(undefined, []),
          'account_final_fk': this.account_final_fk = new FormControl<number | undefined>(undefined, []),
          'phone': this.phone = new FormControl<number | undefined>(undefined),
          'mobile': this.mobil = new FormControl<number | undefined>(undefined),
          'fax': this.fax = new FormControl<number | undefined>(undefined),
          'address': this.address = new FormControl<string | undefined>(undefined),
          'notice': this.notice = new FormControl<string | undefined>(undefined),
          'account_center_fk': this.account_center_fk = new FormControl<number | null>(null, []),
          'account_center': this.account_center = new FormControl<account_center | null>(null, []),
          'branch_fk': this.branch_fk = new FormControl<number | null>(null, [Validators.required]),

        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;

    combineLatest(
      this.PageTreeServiceService.$account_tree).subscribe(
        account_tree_obj => {
          this.selected_Account = account_tree_obj as extende_accounts_tree;

          var Subscription = forkJoin(
            this.Load_AccountLevel(),
            this.Load_AccountGroup(),
            this.Load_AccountClass(),
            this.Load_FinanceList(),
            this.Load_AccountFinal(),
            this.Load_ParentAccountName(),
            this.Load_Account_Center(),
            this.Load_Branch(),
            this.Load_SubFinancialList(),
            this.Load_account_type(),
            //       this.BuildTree()

          ).subscribe(
            res => {
              this.accountLevel_List = res[0];
              this.filteredAccountLevelOptions = of(this.accountLevel_List);
              this.accountLevelService.List_AccountLevel = this.accountLevel_List;
              this.accountLevelService.List_AccountLevel_BehaviorSubject.next(this.accountLevel_List);

              this.accountGroup_List = res[1];
              this.filteredAccountGroupOptions = of(this.accountGroup_List);
              this.accountGroupService.List_AccountGroup = this.accountGroup_List;
              this.accountGroupService.List_AccountGroup_BehaviorSubject.next(this.accountGroup_List);

              this.accountClass_List = res[2];
              this.filteredAccountClassOptions = of(this.accountClass_List);
              this.accountClassService.List_AccountClass = this.accountClass_List;
              this.accountClassService.List_AccountClass_BehaviorSubject.next(this.accountClass_List);

              this.financeList_List = res[3];
              this.filteredfinanceListOptions = of(this.financeList_List);
              this.financeListService.List_FinanceList = this.financeList_List;
              this.financeListService.List_FinanceList_BehaviorSubject.next(this.financeList_List);

              this.accountFinal_List = res[4];
              this.filteredAccountFinalOptions = of(this.accountFinal_List);
              this.accountFinalService.List_AccountsFinal = this.accountFinal_List;
              this.accountFinalService.List_AccountFinal_BehaviorSubject.next(this.accountFinal_List);

              this.parentAccountName_List = res[5];
            /*
              this.parentAccountName_List.push(
                {
                  account_name: 'الجذر',
                  account_id: '',
                  seq: undefined
                }
              );
            */

              this.filteredparentAccountNameOptions = of(this.parentAccountName_List);
              this.accountTreeService.List_AccountsTree = this.parentAccountName_List;
              this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.parentAccountName_List);

              this.account_center_list = res[6];
              this.account_center_filter = of(this.account_center_list);
              this.account_centerService.List_account_center = this.account_center_list;
              this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);

              this.branch_List = res[7];
              this.filteredBranchOptions = of(this.branch_List);
              this.branchService.List_Branch = this.branch_List;
              this.branchService.List_Branch_BehaviorSubject.next(this.branch_List);


              this.sub_financial_list_list = res[8];
              /*
              this.sub_financial_list_list.push(
                {
                  sub_financial_list_name: 'عدم تحديد',
                  sub_financial_list_seq: undefined
                }
              );
              */

              this.filtered_sub_financial_list_list = of(this.sub_financial_list_list);
              this.SubFinancialListService.List_sub_financial_list = this.sub_financial_list_list;
              this.SubFinancialListService.List_sub_financial_list_BehaviorSubject.next(this.sub_financial_list_list);



              this.account_type_list = res[9];
              /*
              this.account_type_list.push(
                {
                  account_type_name: 'عدم تحديد',
                  account_type_seq: undefined
                }
              );
              */

              this.filtered_account_type_list = of(this.account_type_list);
              this.account_typeService.List_account_type = this.account_type_list;
              this.account_typeService.List_account_type_BehaviorSubject.next(this.account_type_list);


              //         this.treeDataSource.data = [res[8]];

              this.Init_AutoComplete();
              this.LoadingFinish = true;

            }
          )

          this._Subscriptions.push(Subscription);

        }
      )



  }

  account_id_change($event: any) {
    console.log();


    if ($event != null && $event.target != null && $event.target.value != null) {
      let value: string = $event.target.value as string;
      if (value != null && value.length > 0) {
        let filter_account_tree: accounts_tree[] = this.parentAccountName_List.filter(x => x.account_id != null && x.account_id == value.substring(0, value.length - 1));

        if (filter_account_tree != null && filter_account_tree.length == 1) {
          this.account_parent_seq.setValue(filter_account_tree[0].seq);
        }




        switch (value.at(0)) {
          case '1':
            var arrs = this.accountGroup_List.filter(x =>
              x.account_group_seq != null &&
              x.account_group_seq == 1
            );
            if (arrs != null && arrs.length > 0) {
              this.account_group_fk.setValue(arrs[0].account_group_seq);
            }

            var arrs_class = this.accountClass_List.filter(x =>
              x.account_class_seq != null &&
              x.account_class_seq == 1
            );
            if (arrs_class != null && arrs_class.length > 0) {
              this.account_class_fk.setValue(arrs[0].account_group_seq);
            }


            break;
          case '2':
            var arrs = this.accountGroup_List.filter(x =>
              x.account_group_seq != null &&
              x.account_group_seq == 2
            );
            if (arrs != null && arrs.length > 0) {
              this.account_group_fk.setValue(arrs[0].account_group_seq);
            }

            var arrs_class = this.accountClass_List.filter(x =>
              x.account_class_seq != null &&
              x.account_class_seq == 1
            );
            if (arrs_class != null && arrs_class.length > 0) {
              this.account_class_fk.setValue(arrs[0].account_group_seq);
            }


            break;
          case '3':
            var arrs = this.accountGroup_List.filter(x =>
              x.account_group_seq != null &&
              x.account_group_seq == 3
            );
            if (arrs != null && arrs.length > 0) {
              this.account_group_fk.setValue(arrs[0].account_group_seq);
            }

            var arrs_class = this.accountClass_List.filter(x =>
              x.account_class_seq != null &&
              x.account_class_seq == 2
            );
            if (arrs_class != null && arrs_class.length > 0) {
              this.account_class_fk.setValue(arrs[0].account_group_seq);
            }




            break;
          case '4':
            var arrs = this.accountGroup_List.filter(x =>
              x.account_group_seq != null &&
              x.account_group_seq == 4
            );
            if (arrs != null && arrs.length > 0) {
              this.account_group_fk.setValue(arrs[0].account_group_seq);
            }

            var arrs_class = this.accountClass_List.filter(x =>
              x.account_class_seq != null &&
              x.account_class_seq == 2
            );
            if (arrs_class != null && arrs_class.length > 0) {
              this.account_class_fk.setValue(arrs[0].account_group_seq);
            }

            break;

        }

        if (value.length == 1) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 1
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }

        } else if (value.length == 2) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 2
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        } else if (value.length == 3) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 3
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        } else if (value.length == 4) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 4
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        } else if (value.length == 5) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 5
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        } else if (value.length == 6) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 6
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        }else if (value.length == 7) {
          var arr_level = this.accountLevel_List.filter(x =>
            x.account_level_seq != null &&
            x.account_level_seq == 7
          );
          if (arr_level != null && arr_level.length > 0) {
            this.account_level_fk.setValue(arr_level[0].account_level_seq);
          }
        }
      }
    }
  }

  Refresh_ParentAccountName_List() {

    this._Subscriptions.push(
      this.accountTreeService.list().subscribe(
        res => {
          this.parentAccountName_List = res;
          this.parentAccountName_List.push(
            {
              account_name: 'الجذر',
              account_id: '',
              seq: undefined
            }
          );
          this.filteredparentAccountNameOptions = of(this.parentAccountName_List);
        }
      )
    );
  }

  Load_SubFinancialList() {
    if (this.SubFinancialListService.List_sub_financial_list == null ||
      this.SubFinancialListService.List_sub_financial_list == undefined ||
      this.SubFinancialListService.List_sub_financial_list.length == 0)
      return this.SubFinancialListService.list();
    return of(this.SubFinancialListService.List_sub_financial_list);

  }

  Load_account_type() {
    if (this.account_typeService.List_account_type == null ||
      this.account_typeService.List_account_type == undefined ||
      this.account_typeService.List_account_type.length == 0)
      return this.account_typeService.list();
    return of(this.account_typeService.List_account_type);
  }


  Load_AccountLevel() {
    if (this.accountLevelService.List_AccountLevel == null ||
      this.accountLevelService.List_AccountLevel == undefined ||
      this.accountLevelService.List_AccountLevel.length == 0)
      return this.accountLevelService.list();
    return of(this.accountLevelService.List_AccountLevel);
  }

  Load_AccountGroup() {
    if (this.accountGroupService.List_AccountGroup == null ||
      this.accountGroupService.List_AccountGroup == undefined ||
      this.accountGroupService.List_AccountGroup.length == 0)
      return this.accountGroupService.list();
    return of(this.accountGroupService.List_AccountGroup);
  }

  Load_AccountClass() {
    if (this.accountClassService.List_AccountClass == null ||
      this.accountClassService.List_AccountClass == undefined ||
      this.accountClassService.List_AccountClass.length == 0)
      return this.accountClassService.list();
    return of(this.accountClassService.List_AccountClass);
  }

  Load_FinanceList() {
    if (this.financeListService.List_FinanceList == null ||
      this.financeListService.List_FinanceList == undefined ||
      this.financeListService.List_FinanceList.length == 0)
      return this.financeListService.list();
    return of(this.financeListService.List_FinanceList);
  }

  Load_AccountFinal() {
    if (this.accountFinalService.List_AccountsFinal == null ||
      this.accountFinalService.List_AccountsFinal == undefined ||
      this.accountFinalService.List_AccountsFinal.length == 0)
      return this.accountFinalService.list();
    return of(this.accountFinalService.List_AccountsFinal);
  }

  Load_ParentAccountName() {
    if (this.accountTreeService.List_AccountsTree == null ||
      this.accountTreeService.List_AccountsTree == undefined ||
      this.accountTreeService.List_AccountsTree.length == 0)
      return this.accountTreeService.list();
    return of(this.accountTreeService.List_AccountsTree);
  }

  Load_Account_Center(): Observable<account_center[]> {
    if (this.account_centerService.List_account_center == null ||
      this.account_centerService.List_account_center == undefined ||
      this.account_centerService.List_account_center.length == 0)
      return this.account_centerService.list();
    return of(this.account_centerService.List_account_center);
  }

  Load_Branch() {
    if (this.branchService.List_Branch == null ||
      this.branchService.List_Branch == undefined ||
      this.branchService.List_Branch.length == 0)
      return this.branchService.list();
    return of(this.branchService.List_Branch);
  }

  public async Init_AutoComplete() {
    try {
      this.filtered_sub_financial_list_list = this.sub_financial_list_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filter_Sub_financial_list(value) : this.sub_financial_list_list.slice())
        );


      this.filtered_account_type_list = this.account_type_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filter_Account_Type(value) : this.account_type_list.slice())
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

      this.filteredAccountFinalOptions = this.account_final_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterAccountFinal(value) : this.accountFinal_List.slice())
        );

      this.filteredparentAccountNameOptions = this.account_parent_seq.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterParentAccountName(value) : this.parentAccountName_List.slice())
        );

      this.account_center_filter = this.account_center_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filter_Account_Center(value) : this.account_center_list.slice())
        );

      this.filteredBranchOptions = this.branch_fk.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterBranch(value) : this.branch_List.slice())
        );


    } catch (Exception: any) { }
  }





  private _filter_Sub_financial_list(value: string): sub_financial_list[] {
    const filterValue = value.toLowerCase();

    return this.sub_financial_list_list.filter(option => option.sub_financial_list_name!.toString().includes(filterValue));

  }

  private _filter_Account_Type(value: string): account_type[] {
    const filterValue = value.toLowerCase();

    return this.account_type_list.filter(option => option.account_type_name!.toString().includes(filterValue));
  }


  private _filterAccountLevel(value: string): account_level[] {
    const filterValue = value.toLowerCase();

    return this.accountLevel_List.filter(option => option.account_level_name!.toString().includes(filterValue));
  }

  private _filterAccountGroup(value: string): account_group[] {
    const filterValue = value.toLowerCase();

    return this.accountGroup_List.filter(option => option.account_group_name!.toString().includes(filterValue));
  }

  private _filterAccountClass(value: string): account_class[] {
    const filterValue = value.toLowerCase();

    return this.accountClass_List.filter(option => option.account_class_name!.toString().includes(filterValue));
  }

  private _filterFinanceList(value: string): finance_list[] {
    const filterValue = value.toLowerCase();

    return this.financeList_List.filter(option => option.finance_list_name!.toString().includes(filterValue));
  }

  private _filterAccountFinal(value: string): account_final[] {
    const filterValue = value.toLowerCase();
    return this.accountFinal_List.filter(option => option.account_final_name!.toString().includes(filterValue));
  }

  private _filterParentAccountName(value: string): extende_accounts_tree[] {
    const filterValue = value.toLowerCase();
    return this.parentAccountName_List.filter(option => (option.account_id != null && option.account_name != null) && (option.account_id.toString().includes(filterValue) || option.account_name.includes(filterValue)));
  }

  private _filter_Account_Center(value: string): account_center[] {
    const filterValue = value.toLowerCase();
    return this.account_center_list.filter(option => (option.account_center_id != null && option.account_center_name != null) && (option.account_center_id.toString().includes(filterValue) || option.account_center_name.includes(filterValue)));
  }

  private _filterBranch(value: string): branch[] {
    const filterValue = value.toLowerCase();
    return this.branch_List.filter(option => option.branch_name!.toString().includes(filterValue));
  }
  public displayAccountLevelProperty(value: string): string {
    if (value && this.accountLevel_List) {
      let cer: any = this.accountLevel_List.find(cer => cer.account_level_seq!.toString() == value);
      if (cer)
        return cer.account_level_name;
    }
    return '';
  }
  public display_Account_TypeProperty(value: string): string {
    if (value && this.account_type_list) {
      let cer: any = this.account_type_list.find(cer => cer.account_type_seq!.toString() == value);
      if (cer)
        return cer.account_type_name;
    }
    return '';
  }

  public display_Sub_FinalList(value: string): string {
    if (value && this.sub_financial_list_list) {
      let cer: any = this.sub_financial_list_list.find(cer => cer.sub_financial_list_seq!.toString() == value);
      if (cer)
        return cer.sub_financial_list_name;
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

  public displayAccountFinalProperty(value: string): string {
    if (value && this.accountFinal_List) {
      let cer: any = this.accountFinal_List.find(cer => cer.account_final_seq!.toString() == value);
      if (cer)
        return cer.account_final_name;
    }
    return '';
  }

  public displayParentAccountNameProperty(value: string): string {
    if (value && this.parentAccountName_List) {
      let account: any = this.parentAccountName_List.find(cer => cer.seq!.toString() == value);
      if (account)
        return account.account_id + " - " + account.account_name!;
    }
    return '';
  }

  public display_Account_Center_Property(value: account_center): string {
    if (value && this.account_center_list) {
      let center: any = this.account_center_list.find(center => center.account_center_seq!.toString() == value);
      if (center)
        return center.account_center_name!;

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

  ngOnDestroy(): void {
    if (this._Subscriptions != null && this._Subscriptions.length > 0) {
      this._Subscriptions.forEach(Subscription => {
        Subscription.unsubscribe();
      });
    }

  }

  BuildTree(): Observable<extende_accounts_tree> {
    return this.accountTreeService.BuildTree();
  }

  ReBuildTree() {
    this.accountTreeService.BuildTree().subscribe(
      res => {
        if (res != null)
          this.treeDataSource.data = res as extende_accounts_tree[];
      }
    )
  }


  ngOnInit() {
    this.account_id.addAsyncValidators([validateAccountId(this.accountTreeService)]);
    this.account_name.addAsyncValidators([validateAccountName(this.accountTreeService)]);

    /*
    this.seq = this.route.snapshot.params['seq'];

    if (this.seq != null && this.seq > 0) {

      this.accountTreeService.get_by_seq(this.seq).subscribe(res => {
        this.selected_Account = res;
        this.SetValue();
        if (this.seq != null && this.seq > 0)
          this.account_parent_seq.setValue(this.parentAccountName_List.find(account => account.seq == this.selected_Account!.account_parent_seq)?.seq);
      });

    }
    */
  }

  public SetValue() {
    try {

      if (this.selected_Account != null && this.selected_Account.seq != null)
        this.seq.setValue(this.selected_Account.seq);


      if (this.selected_Account != null && this.selected_Account.sub_financial_list_fk != null)
        this.sub_financial_list_fk.setValue(this.selected_Account.sub_financial_list_fk);


      if (this.selected_Account != null && this.selected_Account.account_type_fk != null)
        this.seq.setValue(this.selected_Account.account_type_fk);



      console.log('this.selected_Account', this.selected_Account);

      if (this.selected_Account != null && this.selected_Account.account_id != null)
        this.account_id.setValue(this.selected_Account.account_id);

      if (this.selected_Account != null && this.selected_Account.account_name != null)
        this.account_name.setValue(this.selected_Account.account_name);

      if (this.selected_Account != null && this.account_level_fk != null)
        this.account_level_fk.setValue(this.selected_Account.account_level_fk);

      if (this.selected_Account != null && this.selected_Account.account_group_fk != null)
        this.account_group_fk.setValue(this.selected_Account.account_group_fk);

      if (this.selected_Account != null && this.selected_Account.account_class_fk != null)
        this.account_class_fk.setValue(this.selected_Account.account_class_fk);

      if (this.selected_Account != null && this.selected_Account.finance_list_fk != null)
        this.finance_list_fk.setValue(this.selected_Account.finance_list_fk);

      if (this.selected_Account != null && this.selected_Account.account_final_fk != null)
        this.account_final_fk.setValue(this.selected_Account.account_final_fk);

      if (this.selected_Account != null && this.selected_Account.phone != null)
        this.phone.setValue(+this.selected_Account.phone);

      if (this.selected_Account != null && this.selected_Account.mobil != null)
        this.mobil.setValue(+this.selected_Account.mobil);

      if (this.selected_Account != null && this.selected_Account.fax != null)
        this.fax.setValue(+this.selected_Account.fax);

      if (this.selected_Account != null && this.selected_Account.address != null)
        this.address.setValue(this.selected_Account.address);

      if (this.selected_Account != null && this.selected_Account.notice != null)
        this.notice.setValue(this.selected_Account.notice);

      if (this.selected_Account != null && this.selected_Account.account_center_fk != null)
        this.account_center_fk.setValue(this.selected_Account.account_center_fk);

      if (this.selected_Account != null && this.selected_Account.branch_fk != null)
        this.branch_fk.setValue(this.selected_Account.branch_fk);


      if (this.selected_Account != null && this.selected_Account.account_parent_seq != null)
        this.account_parent_seq.setValue(this.selected_Account.account_parent_seq);



    } catch (ex: any) {


    }

  }

  getValue() {
    /*
    this.selected_Account.account_id = this.account_id.value + '' || undefined;
    this.selected_Account.account_name = this.account_name.value || undefined;
    this.selected_Account.account_level_fk = this.account_level_fk.value || undefined;
    this.selected_Account.account_group_fk = this.account_group_fk.value || undefined;
    this.selected_Account.account_class_fk = this.account_class_fk.value || undefined;
    this.selected_Account.finance_list_fk = this.finance_list_fk.value || undefined;
    this.selected_Account.account_final_fk = this.account_final_fk.value || undefined;
    this.selected_Account.phone = this.phone.value + '' || undefined;
    this.selected_Account.mobil = this.mobil.value + '' || undefined;
    this.selected_Account.fax = this.fax.value + '' || undefined;
    this.selected_Account.address = this.address.value || undefined;
    this.selected_Account.notice = this.notice.value || undefined;
    this.selected_Account.account_center_fk = this.account_center_fk.value || undefined;
    this.selected_Account.branch_fk = this.branch_fk.value || undefined;

    // if (this.data.action == 'add'){
    this.selected_Account.account_parent_seq = this.parentAccountName_List.find(account => account.seq == this.account_parent_seq.value)?.seq || undefined;
    // }
    */
    // this.selected_Account = this.Form.value;

  }

  clear() {
    this.Form.reset();
  }

  save() {

    Object.keys(this.Form.controls).forEach(name => {
      if (name != null && this.Form.controls[name] != null) {

        if (!this.Form.controls[name].valid)
          console.log(name, this.Form.controls[name].errors);

      }
    });
    
    if (!this.Form.valid == true) {
      console.log('notValid');
      return;
    } 


    // fill this.selected_AccountsIndex
    this.getValue();
    console.log('this.selected_Account', this.Form.getRawValue());
    if (this.seq.value == 0 || this.seq.value == undefined || this.seq.value == null) {
      this.accountTreeService.add(this.Form.getRawValue()).subscribe(res => {

        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
          this.Form.reset();
          this.Refresh_ParentAccountName_List();
          this.ReBuildTree();
        }

        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }

    else if (this.seq.value != null && this.seq.value > 0) {
      this.accountTreeService.update(this.Form.getRawValue()).subscribe(res => {


        console.log('res', res);
        if (res != null && (res as result) != null && (res as result).success) {
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
          this.Form.reset();
          this.Refresh_ParentAccountName_List();
          this.ReBuildTree();
        }

        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });

          

      });
    }

  }


  focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  public fieldHasErrors(form: any, field: string) {
    return this.formValidatorsService.fieldHasErrors(form, field);
  }


  public autoPrintFirstErrorMessage(
    form: any,
    controlName: string,
    label: string,
    isFemale?: boolean
  ): string {
    return this.formValidatorsService.autoPrintFirstErrorMessage(form, controlName, label, isFemale);
  }

  edit(node: extende_accounts_tree) {

    if (node.seq == 0)
      return;

    this.selected_Account = node;

    this.Form.reset();
    this.Form.patchValue(this.selected_Account);

    this.SetValue();
  }

  addSon(node: extende_accounts_tree) {
    let account_tree: accounts_tree = {};
    account_tree.account_parent_seq = node.seq;
    account_tree.account_parent = node;
    this.PageTreeServiceService.$account_tree.next(account_tree);

  }
}
