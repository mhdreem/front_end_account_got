import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExchangeOrderStage } from 'src/app/modules/shared/models/exchange-order-stage';
import { ExchangeOrderStageService } from 'src/app/modules/shared/services/exchange-order-stage.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { Subscription } from 'rxjs';
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
  _selected_Exchange_order_stage:ExchangeOrderStage= {};
  set selected_Exchange_order_stage(obj:ExchangeOrderStage)
  {
    this._selected_Exchange_order_stage =  obj;
    this.setValue();
  }
  get  selected_Exchange_order_stage():ExchangeOrderStage
  {
    return this._selected_Exchange_order_stage ;
  }

  Form: FormGroup;
  ex_ord_stg_seq: FormControl<number | null>;
  ex_ord_stg_name: FormControl<string | null>;
  ex_ord_stg_order: FormControl<number | null>;
  users: FormArray<FormControl<unknown>>;
 
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

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_Exchange_order_stage = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }


  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'ex_ord_stg_seq': this.ex_ord_stg_seq = new FormControl<number | null>(null, []),
        'ex_ord_stg_name': this.ex_ord_stg_name = new FormControl<string | null>(null, [Validators.required]),
        'ex_ord_stg_order': this.ex_ord_stg_order = new FormControl<number | null>(null, []),
        'users': this.users= this.frmBuilder.array([
        ])
      },
    );
  }

  getUsers(i: number) {
    return this.users.controls[i].value;
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

        if ( this.selected_Exchange_order_stage!.exchange_order_stage_users!= null)
        for (let i=0; i< this.selected_Exchange_order_stage!.exchange_order_stage_users.length; i++){
          if (this.selected_Exchange_order_stage!.exchange_order_stage_users[i]!= null )
          this.users_list.forEach((user, index) =>{
            if (this.selected_Exchange_order_stage!.exchange_order_stage_users!= null && this.selected_Exchange_order_stage!.exchange_order_stage_users[i]!= null )
              if (user.user_seq== this.selected_Exchange_order_stage.exchange_order_stage_users[i].user_fk)
              this.users.controls[index].setValue(true);
            });  
        }
    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.ex_ord_stg_name.value!= null)
          this.selected_Exchange_order_stage.ex_ord_stg_name = this.ex_ord_stg_name.value;


          if (this.ex_ord_stg_order.value!= null)
          this.selected_Exchange_order_stage.ex_ord_stg_order = this.ex_ord_stg_order.value;

          console.log('this.users.controls', this.users.controls);
          for (let i=0; i< this.users_list.length; i++){
            console.log('i', i);
            console.log('this.users.controls[i].value', this.users.controls[i].value);
            if (this.users.controls[i].value!= null)
              if (this.users.controls[i].value == true){
                this.selected_Exchange_order_stage.exchange_order_stage_users= [];
                this.selected_Exchange_order_stage.exchange_order_stage_users?.push({user_fk: this.users_list[i].user_seq, user: this.users_list[i]});
              }
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
    console.log('this.users', this.users);
    // this.dialogRef.close({event:'إلغاء'});
  }

  ngOnInit(): void {
    this.ex_ord_stg_name.addAsyncValidators([validateExOrdStgName(this.exchangeOrderStageService, this.ex_ord_stg_name.value)]);

    this.userService.list().subscribe(res =>{
      this.users_list= res;
      this.users_list.forEach(user =>{
        this.users.push(this.frmBuilder.control(''));
      });
    })
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
