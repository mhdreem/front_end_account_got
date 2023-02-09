import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_level } from 'src/app/modules/shared/models/account-level';
import { result } from 'src/app/modules/shared/models/result';
import { AccountLevelService } from 'src/app/modules/shared/services/account-level.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountLevelName } from './Validators/validateAccountLevelName';

@Component({
  selector: 'app-account-level-add',
  templateUrl: './account-level-add.component.html',
  styleUrls: ['./account-level-add.component.scss']
})
export class AccountLevelAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_level:account_level= {};
  set selected_account_level(obj:account_level)
  {
    this._selected_account_level =  obj;
    this.setValue();
  }
  get  selected_account_level():account_level
  {
    return this._selected_account_level ;
  }

  Form: FormGroup;
  account_level_seq: FormControl<number | null>;
  account_level_name: FormControl<string | null>;
  account_level_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountLevelAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountLevelService: AccountLevelService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_level = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_level_seq': this.account_level_seq = new FormControl<number | null>(null, []),
        'account_level_name': this.account_level_name = new FormControl<string | null>(null, [Validators.required]),
        'account_level_order': this.account_level_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_level!.account_level_seq!!= null)
        this.account_level_seq.setValue(this.selected_account_level!.account_level_seq);

        if (this.selected_account_level!.account_level_name! != null)
        this.account_level_name.setValue(this.selected_account_level!.account_level_name);

        if (this.selected_account_level!.account_level_order!!= null)
        this.account_level_order.setValue(this.selected_account_level!.account_level_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.account_level_name.value!= null)
          this.selected_account_level.account_level_name = this.account_level_name.value;

          if (this.account_level_order.value!= null)
          this.selected_account_level.account_level_order = this.account_level_order.value;
       
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

    if (this.selected_account_level.account_level_seq!!= null)
    {
      this.accountLevelService.update(this.Form.value).subscribe(
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
    }else if (this.selected_account_level.account_level_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountLevelService.add(this.Form.value).subscribe(
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
    this.account_level_name.addAsyncValidators([validateAccountLevelName(this.accountLevelService, this.account_level_name.value)]);

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
