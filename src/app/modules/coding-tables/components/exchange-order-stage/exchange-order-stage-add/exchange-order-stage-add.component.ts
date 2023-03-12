import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  exchange_order_stage } from 'src/app/modules/shared/models/exchange_order_stage';
import { ExchangeOrderStageService } from 'src/app/modules/shared/services/exchange-order-stage.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { forkJoin, Subscription } from 'rxjs';
import { result } from 'src/app/modules/shared/models/result';
import { validateExOrdStgName } from './Validators/validateExOrdStgName';
import { user } from 'src/app/modules/shared/models/user';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-exchange-order-stage-add',
  templateUrl: './exchange-order-stage-add.component.html',
  styleUrls: ['./exchange-order-stage-add.component.scss']
})
export class ExchangeOrderStageAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_Exchange_order_stage:exchange_order_stage= {};
  set selected_Exchange_order_stage(obj:exchange_order_stage)
  {
    this._selected_Exchange_order_stage =  obj;
    this.setValue();
  }
  get  selected_Exchange_order_stage():exchange_order_stage
  {
    return this._selected_Exchange_order_stage ;
  }

  Form: FormGroup;
  ex_ord_stg_seq: FormControl<number | null>;
  ex_ord_stg_name: FormControl<string | null>;
  ex_ord_stg_order: FormControl<number | null>;
 
  users_list: user[]= [];
  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<ExchangeOrderStageAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private formValidatorsService: FormValidationHelpersService,
    private exchangeOrderStageService: ExchangeOrderStageService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar,
    private userService: UserService,
    )  {

      
      if (this.data != null && this.data.obj != null )     
      this.selected_Exchange_order_stage = this.data.obj;
      
      this.BuildForm();

      this.load_date();
      // الان انشاء الواجهة
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }

  load_date()
  {    
    forkJoin(
      this.userService.list()
    ).subscribe(
      res=>
      {
        this.users_list = res[0];
        this.setValue();

      }
    )
  }

  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'ex_ord_stg_seq': this.ex_ord_stg_seq = new FormControl<number | null>(null, []),
        'ex_ord_stg_name': this.ex_ord_stg_name = new FormControl<string | null>(null, [Validators.required]),
        'ex_ord_stg_order': this.ex_ord_stg_order = new FormControl<number | null>(null, []),
        'users':  this.frmBuilder.array([ ])
      },
    );
  }

  get users():FormArray
  {
    return this.Form.get('users') as FormArray;
  }

  create_receipt_order_stage_user_form()
  {
    if ( this.users_list != null && this.users_list.length>0)
    {

      
      this.users_list.forEach(tempuser => {

        let Form = this.frmBuilder.group(
          {
            'is_selected':  new FormControl<boolean | undefined>(undefined, []),
            'user_fk':  new FormControl<number | undefined>(undefined, []),
            'user':  new FormControl<user | undefined>(undefined, []),
            'ex_ord_stg_user_seq':  new FormControl<number | undefined>(undefined, []),        
            'ex_ord_stg_fk':  new FormControl<number | undefined>(undefined, []),        
          }
        );
        Form.controls['user_fk'].setValue(tempuser.user_seq);
        Form.controls['user'].setValue(tempuser);
        Form.controls['ex_ord_stg_user_seq'].setValue(null);
        Form.controls['ex_ord_stg_fk'].setValue(this._selected_Exchange_order_stage.ex_ord_stg_seq);

        if (this.selected_Exchange_order_stage!= null &&
          this.selected_Exchange_order_stage.exchange_order_stage_users!= null 
         )
         {
          var arr  =this.selected_Exchange_order_stage.exchange_order_stage_users.filter(x=>x.user_fk==tempuser.user_seq);
          if (arr != null && arr.length>0)          
            Form.controls['is_selected'].setValue(true);
           else           
             Form.controls['is_selected'].setValue(false);

          
         }
         this.users.push( Form ); 
      });
     
     

    }
        


    
    
  }

  getUser(i: number) : user {
    if (this.users!= null && this.users.length>0)
    {
      var userFormGroup= this.users.controls[i] as FormGroup;
      if (userFormGroup!= null )
      {
        var user = userFormGroup.controls['user'].value;
        return user;
      }

    }
    
    return {};
  
  }

 

  setValue()
  {
    if (this.Form!= null )
    {
      if (this.selected_Exchange_order_stage!.ex_ord_stg_seq!!= null)
        this.ex_ord_stg_seq.setValue(this.selected_Exchange_order_stage!.ex_ord_stg_seq);

        if (this.selected_Exchange_order_stage!.ex_ord_stg_name! != null)
        this.ex_ord_stg_name.setValue(this.selected_Exchange_order_stage!.ex_ord_stg_name);

        if (this.selected_Exchange_order_stage!.ex_ord_stg_order! != null)
        this.ex_ord_stg_order.setValue(this.selected_Exchange_order_stage!.ex_ord_stg_order);

        this.create_receipt_order_stage_user_form();

    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.ex_ord_stg_name.value!= null)
          this.selected_Exchange_order_stage.ex_ord_stg_name = this.ex_ord_stg_name.value;


          if (this.ex_ord_stg_order.value!= null && (this.ex_ord_stg_order.value+ "") != "")
          this.selected_Exchange_order_stage.ex_ord_stg_order = this.ex_ord_stg_order.value;

          console.log('this.users.controls', this.users.controls);
          var users =this.users.value as any[];
         if (users!= null && users.length>0)
         {
          var selectedusers=  users.filter(x=>x.is_selected == true);
          if (selectedusers!= null && selectedusers.length>0)
          this.selected_Exchange_order_stage.exchange_order_stage_users = selectedusers;
         } 
          

       
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

    if (this.selected_Exchange_order_stage.ex_ord_stg_seq!!= null)
    {
      this.exchangeOrderStageService.update(this.selected_Exchange_order_stage).subscribe(
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
    }else if (this.selected_Exchange_order_stage.ex_ord_stg_seq== null)
    {
      console.log('this.selected_Exchange_order_stage', this.selected_Exchange_order_stage);
      this.exchangeOrderStageService.add(this.selected_Exchange_order_stage).subscribe(
        res => {
          console.log('res', res);
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
    // console.log('this.users', this.users);
    this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.ex_ord_stg_name.addAsyncValidators([validateExOrdStgName(this.exchangeOrderStageService, this.ex_ord_stg_name.value)]);

    
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
