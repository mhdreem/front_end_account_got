import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { SanadKidBookService } from 'src/app/modules/shared/services/sanad-kid-book.service';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { AccountTreeService } from 'src/app/modules/shared/services/account-tree.service';
import { result } from 'src/app/modules/shared/models/result';
import { sanad_kid_book } from 'src/app/modules/shared/models/sanad_kid_book';
import { accounts_tree } from 'src/app/modules/shared/models/accounts_tree';

@Component({
  selector: 'app-sanad-kid-book-add',
  templateUrl: './sanad-kid-book-add.component.html',
  styleUrls: ['./sanad-kid-book-add.component.scss']
})
export class SanadKidBookAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  } 
  _selected_SanadKidBook:sanad_kid_book= {};
  set selected_SanadKidBook(obj:sanad_kid_book)
  {
    this._selected_SanadKidBook =  obj;
    this.setValue();
  }
  get  selected_SanadKidBook():sanad_kid_book
  {
    return this._selected_SanadKidBook ;
  }

  _Subscription!: Subscription;


  Form: FormGroup;
  sanad_kid_book_seq: FormControl<number | null>;
  sanad_kid_book_name: FormControl<string | null>;
  sanad_kid_book_order: FormControl<number | null>;
  branch_fk: FormControl<number | null>;
  cash_account_fk: FormControl<number | null>;
  incumbent_id_generate_type_fk!: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  LoadingFinish : boolean;

  branch_list:branch[];
  branch_filter:Observable< branch[]>;
  
  cash_account_list:accounts_tree[];
  cash_account_filter:Observable< accounts_tree[]>;

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<SanadKidBookAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private sanadKidBookService: SanadKidBookService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar,
    private branchService: BranchService,
    private accountTreeService: AccountTreeService

    )  {

     this.BuildForm();
     this.Load_Data(); 
     
    
  }

  Load_Data() {
    this.LoadingFinish = false;
    this._Subscription = forkJoin(
      this.Load_branch(),
      this.Load_cash_account(),
      ).subscribe(
        res => {
          this.branch_list = res[0];
          this.branch_filter = of(this.branch_list);
          this.branchService.List_Branch = this.branch_list;
          this.branchService.List_Branch_BehaviorSubject.next(this.branchService.List_Branch);
          
          this.cash_account_list = res[1];
          this.cash_account_filter = of(this.cash_account_list);
          this.accountTreeService.List_AccountsTree = this.cash_account_list;
          this.accountTreeService.List_AccountsTree_BehaviorSubject.next(this.accountTreeService.List_AccountsTree);

          this.Init_AutoComplete();

          if (this.data != null && this.data.obj != null )     
            this.selected_SanadKidBook = this.data.obj;

          this.LoadingFinish = true;

        }
        )
      }
    
      Load_branch():Observable<branch[]>{
        if (this.branchService.List_Branch == null ||
          this.branchService.List_Branch == undefined ||
          this.branchService.List_Branch.length == 0)
          return this.branchService.list();
        return of(this.branchService.List_Branch);
      }
      
      Load_cash_account():Observable<accounts_tree[]>{
        if (this.accountTreeService.List_AccountsTree == null ||
          this.accountTreeService.List_AccountsTree == undefined ||
          this.accountTreeService.List_AccountsTree.length == 0)
          return this.accountTreeService.list();
        return of(this.accountTreeService.List_AccountsTree);
      }
    
      public async Init_AutoComplete() {
        try {
          this.branch_filter = this.branch_fk.valueChanges
            .pipe(
              startWith(''),
              map((value) => value && typeof value === 'string' ? this._filter_branch(value) : this.branch_list.slice())
            );
         
            this.cash_account_filter = this.cash_account_fk.valueChanges
            .pipe(
              startWith(''),
              map((value) => value && typeof value === 'string' ? this._filter_accounts_tree(value) : this.cash_account_list.slice())
            );
    
        } catch (Exception: any) { }
      }


      private _filter_branch(value: string): branch[] {
        const filterValue = value.toLowerCase();      
        return this.branch_list.filter(option => option.branch_name!= null  &&  option.branch_name.includes(filterValue));
      }
      
      private _filter_accounts_tree(value: string): accounts_tree[] {
        const filterValue = value.toLowerCase();      
        return this.cash_account_list.filter(option => option.account_name!= null  &&  option.account_name.includes(filterValue));
      }

      public display_Branch_Property(value: branch): string {
        if (value && this.branch_list) {      
          let branch: any = this.branch_list.find(branch => branch.branch_seq!.toString() == value);      
          if (branch)
            return branch.branch_name!;
            
        }
        return '';
      }
      
      public display_Accounts_tree_Property(value: accounts_tree): string {
        if (value && this.cash_account_list) {      
          let account: any = this.cash_account_list.find(account => account.seq!.toString() == value);      
          if (account)
            return account.account_name!;
            
        }
        return '';
      }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'sanad_kid_book_seq': this.sanad_kid_book_seq = new FormControl<number | null>(null, []),
        'sanad_kid_book_name': this.sanad_kid_book_name = new FormControl<string | null>(null, [Validators.required]),
        'sanad_kid_book_order': this.sanad_kid_book_order = new FormControl<number | null>(null, []),
        'branch_fk': this.branch_fk = new FormControl<number | null>(null, [Validators.required]),
        'cash_account_fk': this.cash_account_fk = new FormControl<number | null>(null, [Validators.required]),
        'incumbent_id_generate_type_fk': this.incumbent_id_generate_type_fk = new FormControl<number | null>(null, [Validators.required]),
      },
    );
  }

  setValue()
  {
      if (this.selected_SanadKidBook!.sanad_kid_book_seq!!= null)
        this.sanad_kid_book_seq.setValue(this.selected_SanadKidBook!.sanad_kid_book_seq);

        if (this.selected_SanadKidBook!.sanad_kid_book_name! != null)
        this.sanad_kid_book_name.setValue(this.selected_SanadKidBook!.sanad_kid_book_name);

        if (this.selected_SanadKidBook!.branch_fk! != null)
        this.branch_fk.setValue(this.selected_SanadKidBook!.branch_fk);

        if (this.selected_SanadKidBook!.cash_account_fk!!= null)
        this.cash_account_fk.setValue(this.selected_SanadKidBook!.cash_account_fk);

        if (this.selected_SanadKidBook!.incumbent_id_generate_type_fk!!= null)
        this.incumbent_id_generate_type_fk.setValue(this.selected_SanadKidBook!.incumbent_id_generate_type_fk);
        
        if (this.selected_SanadKidBook!.sanad_kid_book_order!!= null)
        this.sanad_kid_book_order.setValue(this.selected_SanadKidBook!.sanad_kid_book_order);
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {
      
        if (this.sanad_kid_book_name.value!= null)
          this.selected_SanadKidBook.sanad_kid_book_name = this.sanad_kid_book_name.value;


          if (this.branch_fk.value!= null)
          this.selected_SanadKidBook.branch_fk = this.branch_fk.value;



          if (this.cash_account_fk.value!= null)
          this.selected_SanadKidBook.cash_account_fk = this.cash_account_fk.value;

          if (this.incumbent_id_generate_type_fk.value!= null)
          this.selected_SanadKidBook.incumbent_id_generate_type_fk = this.incumbent_id_generate_type_fk.value;
          
          if (this.sanad_kid_book_order.value!= null && (this.sanad_kid_book_order.value+ "") != "")
          this.selected_SanadKidBook.sanad_kid_book_order = this.sanad_kid_book_order.value;


       
        }
  }

  ResetForm()
  {
    this.Form.reset();
  }

  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_SanadKidBook.sanad_kid_book_seq!!= null)
    {
      this.sanadKidBookService.update(this.Form.value).subscribe(
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تم التعديل بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم يتم التعديل بنجاح','',{ panelClass: ['red-snackbar']});
          
          }
          
        },
        err => console.log('HTTP Error', err),
      
      )
    }else if (this.selected_SanadKidBook.sanad_kid_book_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.sanadKidBookService.add(this.Form.value).subscribe(
        res => {
          console.log('res',res);
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تمت الإضافة بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم تتم الإضافة بنجاح','',{panelClass: ['red-snackbar']});
          }
        },
        err => console.log('HTTP Error', err),
      
      )
    }

  }


  closeDialog(){
    // console.log('formgroup.controls',this.account_center_name.errors);
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {

  }

  public focusNext(id: string) {
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


}
