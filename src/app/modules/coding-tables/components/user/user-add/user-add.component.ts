import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { branch } from 'src/app/modules/shared/models/branch';
import { department } from 'src/app/modules/shared/models/department';
import { result } from 'src/app/modules/shared/models/result';
import { user } from 'src/app/modules/shared/models/user';
import { BranchService } from 'src/app/modules/shared/services/branch.service';
import { DepartmentService } from 'src/app/modules/shared/services/department.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { validateUserName } from './Validators/validateUserName';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }

  _selected_user:user= {};
  set selected_user(obj:user)
  {
    this._selected_user =  obj;
    this.setValue();
  }
  get  selected_user():user
  {
    return this._selected_user ;
  }

  Form: FormGroup;
  user_seq : FormControl;
  user_first_name : FormControl;
  user_last_name : FormControl;
  user_name : FormControl;
  user_password : FormControl;
  department_fk : FormControl;
  branch_fk : FormControl;
 
  department_List: department[] = [];
  filteredDepartmentLevelOptions!: Observable<department[]>;
  branch_List: branch[] = [];
  filteredBranchOptions!: Observable<branch[]>;
  
  LoadingFinish : boolean;

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<UserAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private userService: UserService,
    private departmentService: DepartmentService,
    private branchService: BranchService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {
      this.LoadingFinish = true;

      this.BuildForm();
      this.Load_Data();

     if (this.data != null && this.data.obj != null )     
      this.selected_user = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'user_seq': this.user_seq = new FormControl<number | null>(null, []),
        'user_first_name': this.user_first_name = new FormControl<string | null>(null, [Validators.required]),
        'user_last_name': this.user_last_name = new FormControl<string | null>(null, [Validators.required]),
        'user_name': this.user_name = new FormControl<string | null>(null, [Validators.required]),
        'user_password': this.user_password = new FormControl<string | null>(null, [Validators.required]),
        'department_fk': this.department_fk = new FormControl<number | null>(null, [Validators.required]),
        'branch_fk': this.branch_fk = new FormControl<number | null>(null, [Validators.required]),
      },
    );
  }

  Load_Data() {
    this.LoadingFinish = false;
    this.Subscription = forkJoin(
      this.Load_Department(),
      this.Load_Branch(),
      ).subscribe(
        res => {
          this.department_List = res[0];
          this.filteredDepartmentLevelOptions = of(this.department_List);
          this.departmentService.List_Department = this.department_List;
          this.departmentService.List_Department_BehaviorSubject.next(this.department_List);

          this.branch_List = res[1];
          this.filteredBranchOptions = of(this.branch_List);
          this.branchService.List_Branch = this.branch_List;
          this.branchService.List_Branch_BehaviorSubject.next(this.branch_List);
      }
      )
    }

    Load_Department(){
      if (this.departmentService.List_Department == null ||
        this.departmentService.List_Department == undefined ||
        this.departmentService.List_Department.length == 0)
        return this.departmentService.list();
      return of(this.departmentService.List_Department);
    }

    Load_Branch(){
      if (this.branchService.List_Branch == null ||
        this.branchService.List_Branch == undefined ||
        this.branchService.List_Branch.length == 0)
        return this.branchService.list();
      return of(this.branchService.List_Branch);
    }

    public async Init_AutoComplete() {
      try {
        this.filteredDepartmentLevelOptions = this.department_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterDepartment(value) : this.department_List.slice())
          );

        this.filteredBranchOptions = this.branch_fk.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterBranch(value) : this.branch_List.slice())
          );

        } catch (Exception: any) { }
      }

      private _filterDepartment(value: string): department[] {
        const filterValue = value.toLowerCase();
    
        return this.department_List.filter(option => option.department_seq == +filterValue);
      }

      private _filterBranch(value: string): branch[] {
        const filterValue = value.toLowerCase();
    
        return this.branch_List.filter(option => option.branch_seq == +filterValue);
      }

      public displayDepartmentProperty(value: string): string {
        if (value && this.department_List) {
          let cer: any = this.department_List.find(cer => cer.department_seq!.toString() == value);
          if (cer)
            return cer.department_name;
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

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_user!.user_seq!!= null)
        this.user_seq.setValue(this.selected_user!.user_seq);

        if (this.selected_user!.user_first_name! != null)
        this.user_first_name.setValue(this.selected_user!.user_first_name);

        if (this.selected_user!.user_last_name! != null)
        this.user_last_name.setValue(this.selected_user!.user_last_name);

        if (this.selected_user!.user_name!!= null)
        this.user_name.setValue(this.selected_user!.user_name);

        if (this.selected_user!.user_password!!= null)
        this.user_password.setValue(this.selected_user!.user_password);
        
        if (this.selected_user!.department_fk!!= null)
        this.department_fk.setValue(this.selected_user!.department_fk);
        
        if (this.selected_user!.branch_fk!!= null)
        this.branch_fk.setValue(this.selected_user!.branch_fk);
    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.user_first_name.value!= null)
          this.selected_user.user_first_name = this.user_first_name.value;


          if (this.user_last_name.value!= null)
          this.selected_user.user_last_name = this.user_last_name.value;



          if (this.user_name.value!= null)
          this.selected_user.user_name = this.user_name.value;

          if (this.user_password.value!= null)
          this.selected_user.user_password = this.user_password.value;

          if (this.department_fk.value!= null)
          this.selected_user.department_fk = this.department_fk.value;

          if (this.branch_fk.value!= null)
          this.selected_user.branch_fk = this.branch_fk.value;


       
        }
  }

 
  ResetForm()
  {
    this.Form.reset();
    this.focusNext('user_first_name')
  }


  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_user.user_seq!!= null)
    {
      this.userService.update(this.Form.value).subscribe(
        res => {
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تم التعديل بنجاح','',{duration: 3000, panelClass: ['green-snackbar']});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم يتم التعديل بنجاح','',{panelClass: ['red-snackbar']});
          
          }
          
        },
        err => console.log('HTTP Error', err),
      
      )
    }else if (this.selected_user.user_seq== null)
    {
      this.userService.add(this.Form.value).subscribe(
        res => {
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
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.user_name.addAsyncValidators([validateUserName(this.userService, this.user_name.value)]);

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
