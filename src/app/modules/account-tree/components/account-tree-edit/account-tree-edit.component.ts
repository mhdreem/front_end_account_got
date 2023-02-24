import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { account_center } from 'src/app/modules/shared/models/account_center';
import { account_class } from 'src/app/modules/shared/models/account_class';
import { account_final } from 'src/app/modules/shared/models/account_final';
import { account_group } from 'src/app/modules/shared/models/account_group';
import { account_level } from 'src/app/modules/shared/models/account_level';
import { finance_list } from 'src/app/modules/shared/models/finance_list';
import { result } from 'src/app/modules/shared/models/result';
import { account_centerService } from 'src/app/modules/shared/services/account-center.service';
import { AccountClassService } from 'src/app/modules/shared/services/account-class.service';
import { AccountFinalService } from 'src/app/modules/shared/services/account-final.service';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { FinanceListService } from 'src/app/modules/shared/services/finance-list.service';
import {accounts_tree} from '../../../shared/models/accounts_tree'
@Component({
  selector: 'app-account-tree-edit',
  templateUrl: './account-tree-edit.component.html',
  styleUrls: ['./account-tree-edit.component.scss']
})
export class AccountTreeEditComponent implements OnInit, OnDestroy {

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }

  _Subscription!: Subscription;
 
  Form!: FormGroup;
  parentAccountName!: FormControl<string | undefined  | null>;
  account_id!: FormControl<number | undefined  | null>;
  account_name!: FormControl<string | undefined  | null>;
  account_level!: FormControl<number | undefined  | null>;
  account_group!: FormControl<number | undefined  | null>;
  account_class!: FormControl<number | undefined  | null>;
  finance_list!: FormControl<number | undefined  | null>;
  account_final!: FormControl<number | undefined  | null>;
  phone!: FormControl<number | undefined  | null>;
  mobil!: FormControl<number | undefined  | null>;
  fax!: FormControl<number | undefined  | null>;
  address!: FormControl<string | undefined  | null>;
  notice!: FormControl<string | undefined  | null>;
  account_center_fk!: FormControl<number | null>;
  account_center!: FormControl<account_center | null>;


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
  parentAccountName_List: accounts_tree[] = [];
  filteredparentAccountNameOptions!: Observable<accounts_tree[]>;
  account_center_list: account_center[];
  account_center_filter: Observable<account_center[]>;

  selected_Account: accounts_tree= {};

  LoadingFinish : boolean;

  constructor(public dialogRef: MatDialogRef<AccountTreeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {action: string, account: accounts_tree},
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private accountLevelService: AccountLevelService,
    private accountGroupService: AccountGroupService,
    private accountClassService: AccountClassService,
    private financeListService: FinanceListService,
    private accountFinalService: AccountFinalService,
    private accountTreeService: AccountTreeService,
    private account_centerService: account_centerService) { 
      this.LoadingFinish = true;
      this.BuildForm();
      this.Load_Data();
      
      
      if (this.data.action == 'update'){
        this.selected_Account= data.account;
        this.SetValue();
      }
      
    }

    public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'parentAccountName:': this.parentAccountName = new FormControl<string | undefined>(undefined, []),
            'account_id:': this.account_id = new FormControl<number | undefined>(undefined, [Validators.required]),
            'account_name:': this.account_name = new FormControl<string | undefined>(undefined, [Validators.required]),
            'account_level:': this.account_level = new FormControl<number | undefined>(undefined, [Validators.required]),
            'account_group:': this.account_group = new FormControl<number | undefined>(undefined, [Validators.required]),
            'account_class:': this.account_class = new FormControl<number | undefined>(undefined, [Validators.required]),
            'finance_list:': this.finance_list = new FormControl<number | undefined>(undefined, [Validators.required]),
            'account_final:': this.account_final = new FormControl<number | undefined>(undefined, [Validators.required]),
            'phone:': this.phone = new FormControl<number | undefined>(undefined),
            'mobile:': this.mobil = new FormControl<number | undefined>(undefined),
            'fax:': this.fax = new FormControl<number | undefined>(undefined),
            'address:': this.address = new FormControl<string | undefined>(undefined),
            'notice:': this.notice = new FormControl<string | undefined>(undefined),
            'account_center_fk': this.account_center_fk = new FormControl<number | null>(null, []),
          'account_center': this.account_center = new FormControl<account_center | null>(null, []),
          },
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }

    Load_Data() {
      this.LoadingFinish = false;
      this._Subscription = forkJoin(
        this.Load_AccountLevel(),
        this.Load_AccountGroup(),
        this.Load_AccountClass(),
        this.Load_FinanceList(),
        this.Load_AccountFinal(),
        this.Load_ParentAccountName(),
        this.Load_Account_Center()
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
          this.filteredparentAccountNameOptions = of(this.parentAccountName_List);
          this.accountTreeService.List_AccountsTree = this.parentAccountName_List;
          this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.parentAccountName_List);
  
          this.account_center_list = res[6];
          this.account_center_filter = of(this.account_center_list);
          this.account_centerService.List_account_center = this.account_center_list;
          this.account_centerService.List_account_center_BehaviorSubject.next(this.account_center_list);


          if (this.data!.account!.seq != null)
            this.parentAccountName.setValue(this.parentAccountName_List.find(account=> account.seq == this.data!.account!.seq)?.account_name);

            this.Init_AutoComplete();
            this.LoadingFinish = true;

          }
          )
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
          
          Load_AccountFinal(){
            if (this.accountFinalService.List_AccountsFinal == null ||
              this.accountFinalService.List_AccountsFinal == undefined ||
              this.accountFinalService.List_AccountsFinal.length == 0)
              return this.accountFinalService.list();
            return of(this.accountFinalService.List_AccountsFinal);
          }
        
          Load_ParentAccountName(){
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
        
        public async Init_AutoComplete() {
          try {
            this.filteredAccountLevelOptions = this.account_level.valueChanges
              .pipe(
                startWith(''),
                map(value => value && typeof value === 'string' ? this._filterAccountLevel(value) : this.accountLevel_List.slice())
              );
      
            this.filteredAccountGroupOptions = this.account_group.valueChanges
              .pipe(
                startWith(''),
                map(value => value && typeof value === 'string' ? this._filterAccountGroup(value) : this.accountGroup_List.slice())
              );
      
            this.filteredAccountClassOptions = this.account_class.valueChanges
              .pipe(
                startWith(''),
                map(value => value && typeof value === 'string' ? this._filterAccountClass(value) : this.accountClass_List.slice())
              );
      
              this.filteredfinanceListOptions = this.finance_list.valueChanges
              .pipe(
                startWith(''),
                map(value => value && typeof value === 'string' ? this._filterFinanceList(value) : this.financeList_List.slice())
                );
                
                this.filteredAccountFinalOptions = this.account_final.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => value && typeof value === 'string' ? this._filterAccountFinal(value) : this.accountFinal_List.slice())
                  );
          
                this.filteredparentAccountNameOptions = this.parentAccountName.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => value && typeof value === 'string' ? this._filterParentAccountName(value) : this.parentAccountName_List.slice())
                  );
          
                  this.account_center_filter = this.account_center_fk.valueChanges
                    .pipe(
                      startWith(''),
                      map(value => value && typeof value === 'string' ? this._filter_Account_Center(value) : this.account_center_list.slice())
                    );
            
      
          } catch (Exception: any) { }
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
        
        private _filterParentAccountName(value: string): accounts_tree[] {
          const filterValue = value.toLowerCase();
      
          return this.parentAccountName_List.filter(option =>(option.account_id != null && option.account_name != null) && (option.account_id.toString().includes(filterValue) || option.account_name.includes(filterValue)));
        }

        private _filter_Account_Center(value: string): account_center[] {
          const filterValue = value.toLowerCase();
          return this.account_center_list.filter(option => (option.account_center_id != null && option.account_center_name != null) && (option.account_center_id.toString().includes(filterValue) || option.account_center_name.includes(filterValue)));
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
            let cer: any = this.parentAccountName_List.find(cer => cer.seq!.toString() == value);
            if (cer)
              return cer.account_name;
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
    
        ngOnDestroy(): void {
          this._Subscription.unsubscribe();
        }
        
  ngOnInit() {      
  }

  public SetValue() {
    try {


      if (this.selected_Account != null && this.selected_Account.account_id != null)
        this.account_id.setValue(+this.selected_Account.account_id);
        
      if (this.selected_Account != null && this.selected_Account.account_name != null)
        this.account_name.setValue(this.selected_Account.account_name);

      if (this.selected_Account != null && this.selected_Account.account_level != null)
        this.account_level.setValue(this.selected_Account.account_level.account_level_seq);

      if (this.selected_Account != null && this.selected_Account.account_group != null)
        this.account_group.setValue(this.selected_Account.account_group.account_group_seq);
      
      if (this.selected_Account != null && this.selected_Account.account_class != null)
        this.account_class.setValue(this.selected_Account.account_class.account_class_seq);
      
        if (this.selected_Account != null && this.selected_Account.finance_list != null)
        this.finance_list.setValue(this.selected_Account.finance_list.finance_list_seq);
        
        if (this.selected_Account != null && this.selected_Account.account_final != null)
          this.account_final.setValue(this.selected_Account.account_final.account_final_seq);
        
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
      
    } catch (ex: any) {


    }

  }

  getValue(){
    this.selected_Account.account_id= this.account_id.value+'' || undefined;
    this.selected_Account.account_name= this.account_name.value || undefined;
    this.selected_Account.account_level_fk= this.account_level.value || undefined;
    this.selected_Account.account_group_fk= this.account_group.value || undefined;
    this.selected_Account.account_class_fk = this.account_class.value || undefined;
    this.selected_Account.finance_list_fk= this.finance_list.value || undefined;
    this.selected_Account.account_final_fk = this.account_final.value || undefined;
    this.selected_Account.phone = this.phone.value+''  || undefined;
    this.selected_Account.mobil= this.mobil.value+'' || undefined;
    this.selected_Account.fax = this.fax.value+'' || undefined;
    this.selected_Account.address = this.address.value || undefined;
    this.selected_Account.notice = this.notice.value || undefined;
    this.selected_Account.account_center_fk = this.account_center_fk.value || undefined;
    
    if (this.data.action == 'add'){
      this.selected_Account.account_parent_seq = this.parentAccountName_List.find(account=> account.account_name == this.parentAccountName.value)?.seq || undefined;;
    }
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clear(){
    this.Form.reset();
  }

  save(){
    if (!this.Form.valid == true) {
      console.log('notValid');
      return;
    }

    // fill this.selected_AccountsIndex
    this.getValue();
    console.log('this.selected_Account', this.selected_Account);
    if (this.data.action== 'add'){
      this.accountTreeService.add( this.selected_Account).subscribe(res =>{
        console.log('res', res);
        if (res != null && (res as result)!= null &&  (res as result).success ){
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        this.dialogRef.close(1);
        }

        else
          this.snackBar.open('حدث خطأ', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
      });
    }

    else if (this.data.action== 'update'){
      this.accountTreeService.update( this.selected_Account).subscribe(res =>{
        if (res != null && (res as accounts_tree) != null && (res as accounts_tree).seq!= null ){
          this.snackBar.open('تم التعديل بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
        this.dialogRef.close(1);
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

}
