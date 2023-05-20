import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { account_classification } from 'src/app/modules/shared/models/account-classification';
import { result } from 'src/app/modules/shared/models/result';
import { AccountclassificationService } from 'src/app/modules/shared/services/account-classification.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import {validateAccountClassName} from './Validators/validateAccountClassificationName'
@Component({
  selector: 'app-account-classification-add',
  templateUrl: './account-classification-add.component.html',
  styleUrls: ['./account-classification-add.component.scss']
})
export class AccountClassificationAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_AccountClassification:account_classification= {};
  set selected_AccountClassification(obj:account_classification)
  {
    this._selected_AccountClassification =  obj;
    this.setValue();
  }
  get  selected_AccountClassification():account_classification
  {
    return this._selected_AccountClassification ;
  }

  Form: FormGroup;
  classification_seq: FormControl<number | null>;
  classification_name: FormControl<string | null>;
  AccountClassification_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AccountClassificationAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private accountclassificationService: AccountclassificationService,    
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_AccountClassification = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'classification_seq': this.classification_seq = new FormControl<number | null>(null, []),
        'classification_name': this.classification_name = new FormControl<string | null>(null, [Validators.required]),
        'AccountClassification_order': this.AccountClassification_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_AccountClassification!.classification_seq!!= null)
        this.classification_seq.setValue(this.selected_AccountClassification!.classification_seq);

        if (this.selected_AccountClassification!.classification_name! != null)
        this.classification_name.setValue(this.selected_AccountClassification!.classification_name);

        // if (this.selected_AccountClassification!.AccountClassification_order!!= null)
        // this.AccountClassification_order.setValue(this.selected_AccountClassification!.AccountClassification_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.classification_name.value!= null)
          this.selected_AccountClassification.classification_name = this.classification_name.value;

          // if (this.AccountClassification_order.value!= null && (this.AccountClassification_order.value+ "") != "")
          // this.selected_AccountClassification.AccountClassification_order = this.AccountClassification_order.value;
       
        }
  }

 
  ResetForm()
  {
    this.Form.reset();
    this.focusNext('classification_name')
  }


  save()
  {
    if (this.Form.valid == false)
    {
      //print error using snaker
    }
    this.getValue();

    if (this.selected_AccountClassification.classification_seq!!= null)
    {
      this.accountclassificationService.update(this.Form.value).subscribe(
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
    }else if (this.selected_AccountClassification.classification_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.accountclassificationService.add(this.Form.value).subscribe(
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
    // console.log('this.Form.errors', this.Form.errors);
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.classification_name.addAsyncValidators([validateAccountClassName(this.accountclassificationService, this.classification_name.value)]);

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
