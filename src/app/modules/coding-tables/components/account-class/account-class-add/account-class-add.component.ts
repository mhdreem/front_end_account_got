import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_class } from 'src/app/modules/shared/models/account-class';
import { result } from 'src/app/modules/shared/models/result';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import {AccountClassService} from '../../../../shared/services/account-class.service'
import { validateAccountClassName } from './Validators/validateAccountClassName';

@Component({
  selector: 'app-account-class-add',
  templateUrl: './account-class-add.component.html',
  styleUrls: ['./account-class-add.component.scss']
})
export class AccountClassAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_account_class:account_class= {};
  set selected_account_class(obj:account_class)
  {
    this._selected_account_class =  obj;
    this.setValue();
  }
  get  selected_account_class():account_class
  {
    return this._selected_account_class ;
  }

  Form: FormGroup;
  account_class_seq: FormControl<number | null>;
  account_class_name: FormControl<string | null>;
  account_class_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountClassAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountClassService: AccountClassService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_account_class = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'account_class_seq': this.account_class_seq = new FormControl<number | null>(null, []),
        'account_class_name': this.account_class_name = new FormControl<string | null>(null, [Validators.required]),
        'account_class_order': this.account_class_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_account_class!.account_class_seq!!= null)
        this.account_class_seq.setValue(this.selected_account_class!.account_class_seq);

        if (this.selected_account_class!.account_class_name! != null)
        this.account_class_name.setValue(this.selected_account_class!.account_class_name);

        if (this.selected_account_class!.account_class_order!!= null)
        this.account_class_order.setValue(this.selected_account_class!.account_class_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.account_class_name.value!= null)
          this.selected_account_class.account_class_name = this.account_class_name.value;

          if (this.account_class_order.value!= null)
          this.selected_account_class.account_class_order = this.account_class_order.value;
       
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

    if (this.selected_account_class.account_class_seq!!= null)
    {
      this.accountClassService.update(this.Form.value).subscribe(
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
    }else if (this.selected_account_class.account_class_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountClassService.add(this.Form.value).subscribe(
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
    console.log('this.Form.errors', this.Form.errors);
    // this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.account_class_name.addAsyncValidators([validateAccountClassName(this.accountClassService, this.account_class_name.value)]);

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
