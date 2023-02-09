import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_group } from 'src/app/modules/shared/models/account-group';
import { result } from 'src/app/modules/shared/models/result';
import { AccountGroupService } from 'src/app/modules/shared/services/account-group.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountGroupName } from './Validators/validateAccountGroupName';

@Component({
  selector: 'app-account-group-add',
  templateUrl: './account-group-add.component.html',
  styleUrls: ['./account-group-add.component.scss']
})
export class AccountGroupAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_group:account_group= {};
  set selected_account_group(obj:account_group)
  {
    this._selected_account_group =  obj;
    this.setValue();
  }
  get  selected_account_group():account_group
  {
    return this._selected_account_group ;
  }

  Form: FormGroup;
  account_group_seq: FormControl<number | null>;
  account_group_name: FormControl<string | null>;
  account_group_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountGroupAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountGroupService: AccountGroupService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_group = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_group_seq': this.account_group_seq = new FormControl<number | null>(null, []),
        'account_group_name': this.account_group_name = new FormControl<string | null>(null, [Validators.required]),
        'account_group_order': this.account_group_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_group!.account_group_seq!!= null)
        this.account_group_seq.setValue(this.selected_account_group!.account_group_seq);

        if (this.selected_account_group!.account_group_name! != null)
        this.account_group_name.setValue(this.selected_account_group!.account_group_name);

        if (this.selected_account_group!.account_group_order!!= null)
        this.account_group_order.setValue(this.selected_account_group!.account_group_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.account_group_name.value!= null)
          this.selected_account_group.account_group_name = this.account_group_name.value;

          if (this.account_group_order.value!= null)
          this.selected_account_group.account_group_order = this.account_group_order.value;
       
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

    if (this.selected_account_group.account_group_seq!!= null)
    {
      this.accountGroupService.update(this.Form.value).subscribe(
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
    }else if (this.selected_account_group.account_group_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountGroupService.add(this.Form.value).subscribe(
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
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.account_group_name.addAsyncValidators([validateAccountGroupName(this.accountGroupService, this.account_group_name.value)]);

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
