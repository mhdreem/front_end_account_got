import { Component, HostListener, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { attachement_type } from 'src/app/modules/shared/models/attachement_type';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { AttachmentTypeService } from 'src/app/modules/shared/services/attachment-type.service';
import { result } from 'src/app/modules/shared/models/result';
import { validateAttachmentTypeName } from './Validators/validateAttachmentTypeName';

@Component({
  selector: 'app-attachment-type-add',
  templateUrl: './attachment-type-add.component.html',
  styleUrls: ['./attachment-type-add.component.scss']
})
export class AttachmentTypeAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_attachment_type:attachement_type= {};
  set selected_attachment_type(obj:attachement_type)
  {
    this._selected_attachment_type =  obj;
    this.setValue();
  }
  get  selected_attachment_type():attachement_type
  {
    return this._selected_attachment_type ;
  }

  Form: FormGroup;
  attachement_type_seq: FormControl<number | null>;
  attachement_type_name: FormControl<string | null>;
  attachement_type_order: FormControl<number | null>;
 

  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AttachmentTypeAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private formValidatorsService: FormValidationHelpersService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar,
    private attachmentTypeService: AttachmentTypeService
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_attachment_type = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'attachement_type_seq': this.attachement_type_seq = new FormControl<number | null>(null, []),
        'attachement_type_name': this.attachement_type_name = new FormControl<string | null>(null, [Validators.required]),
        'attachement_type_order': this.attachement_type_order = new FormControl<number | null>(null, []),
      },
    );
  }

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_attachment_type!.attachement_type_seq!!= null)
        this.attachement_type_seq.setValue(this.selected_attachment_type!.attachement_type_seq);

        if (this.selected_attachment_type!.attachement_type_name! != null)
        this.attachement_type_name.setValue(this.selected_attachment_type!.attachement_type_name);

        if (this.selected_attachment_type!.attachement_type_order!!= null)
        this.attachement_type_order.setValue(this.selected_attachment_type!.attachement_type_order);
    }
  }

  getValue()
  {
    console.log('this.Form.value',this.Form.value);
    if (this.Form!= null )
    {


          if (this.attachement_type_name.value!= null)
          this.selected_attachment_type.attachement_type_name = this.attachement_type_name.value;

          if (this.attachement_type_order.value!= null)
          this.selected_attachment_type.attachement_type_order = this.attachement_type_order.value;
       
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

    if (this.selected_attachment_type.attachement_type_seq!!= null)
    {
      this.attachmentTypeService.update(this.Form.value).subscribe(
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
    }else if (this.selected_attachment_type.attachement_type_seq== null)
    {
    console.log('this.Form.value',this.Form.value);

      this.attachmentTypeService.add(this.Form.value).subscribe(
        res => {
          console.log('res',res);
          if (res != null && (res as result)!= null &&  (res as result).success)
          {
            this.SnackBar.open('تمت الإضافة بنجاح','',{duration: 3000});
            this.ResetForm();
          }else 
          {
            this.SnackBar.open('لم تتم الإضافة بنجاح','',{});
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
    this.attachement_type_name.addAsyncValidators([validateAttachmentTypeName(this.attachmentTypeService, this.attachement_type_name.value)]);

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
