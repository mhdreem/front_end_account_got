import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_type } from 'src/app/modules/shared/models/account_type';
import { result } from 'src/app/modules/shared/models/result';
import { account_typeService } from 'src/app/modules/shared/services/account-type.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { validateAccountTypeName } from './Validators/validateAccountTypeName';

@Component({
  selector: 'app-account-type-add',
  templateUrl: './account-type-add.component.html',
  styleUrls: ['./account-type-add.component.scss']
})
export class AccountTypeAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_type:account_type= {};
  set selected_account_type(obj:account_type)
  {
    this._selected_account_type =  obj;
    this.setValue();
  }
  get  selected_account_type():account_type
  {
    return this._selected_account_type ;
  }

  Form: FormGroup;
  account_type_seq: FormControl<number | null>;
  account_type_name: FormControl<string | null>;
  account_type_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountTypeAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private account_typeService: account_typeService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_type = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_type_seq': this.account_type_seq = new FormControl<number | null>(null, []),
        'account_type_name': this.account_type_name = new FormControl<string | null>(null, [Validators.required]),
        'account_type_order': this.account_type_order = new FormControl<number | null>(null, []),
      },
    );
    this.account_type_name.addAsyncValidators([validateAccountTypeName(this.account_typeService)]);

  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_type!.account_type_seq!!= null)
        this.account_type_seq.setValue(this.selected_account_type!.account_type_seq);

        if (this.selected_account_type!.account_type_name! != null)
        this.account_type_name.setValue(this.selected_account_type!.account_type_name);

        if (this.selected_account_type!.account_type_order!!= null)
        this.account_type_order.setValue(this.selected_account_type!.account_type_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.account_type_name.value!= null)
          this.selected_account_type.account_type_name = this.account_type_name.value;

          if (this.account_type_order.value!= null && (this.account_type_order.value+ "") != "")
          this.selected_account_type.account_type_order = this.account_type_order.value;
       
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

    if (this.selected_account_type.account_type_seq!!= null)
    {
      this.account_typeService.update(this.Form.value).subscribe(
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
    }else if (this.selected_account_type.account_type_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.account_typeService.add(this.Form.value).subscribe(
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
