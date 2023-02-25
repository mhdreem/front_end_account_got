import { Component, HostListener, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sanad_kid_stage } from 'src/app/modules/shared/models/sanad_kid_stage';
import { user } from 'src/app/modules/shared/models/user';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/form-validation-helpers.service';
import { SanadKidStageService } from 'src/app/modules/shared/services/sanad-kid-stage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { DOCUMENT } from '@angular/common';
import { result } from 'src/app/modules/shared/models/result';
import { validateSndKidStgName } from './Validators/validateSndKidStgName';

@Component({
  selector: 'app-sanad-kid-stage-add',
  templateUrl: './sanad-kid-stage-add.component.html',
  styleUrls: ['./sanad-kid-stage-add.component.scss']
})
export class SanadKidStageAddComponent {
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode == 120){
      event.preventDefault();
      this.save();
    }
    
  }
  _selected_Sanad_kid_stage:Sanad_kid_stage= {};
  set selected_Sanad_kid_stage(obj:Sanad_kid_stage)
  {
    this._selected_Sanad_kid_stage =  obj;
    this.setValue();
  }
  get  selected_Sanad_kid_stage():Sanad_kid_stage
  {
    return this._selected_Sanad_kid_stage ;
  }

  Form: FormGroup;
  snd_kid_stg_seq: FormControl<number | null>;
  snd_kid_stg_name: FormControl<string | null>;
  snd_kid_stg_order: FormControl<number | null>;
  users: FormArray<FormControl<unknown>>;
 
  users_list: user[]= [];
  Subscription:Subscription = new Subscription();

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<SanadKidStageAddComponent>,  
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,   
    private formValidatorsService: FormValidationHelpersService,
    private sanadKidStageService: SanadKidStageService,
    @Inject(DOCUMENT) private _document: Document,
    public SnackBar:MatSnackBar,
    private userService: UserService,
    )  {

     this.BuildForm();

     if (this.data != null && this.data.obj != null )     
      this.selected_Sanad_kid_stage = this.data.obj;
    
  }

  ngOnDestroy(): void {
   if (this.Subscription!= null)  this.Subscription.unsubscribe();  
  }


  BuildForm()
  {
    this.Form = this.frmBuilder.group(
      {
        'snd_kid_stg_seq': this.snd_kid_stg_seq = new FormControl<number | null>(null, []),
        'snd_kid_stg_name': this.snd_kid_stg_name = new FormControl<string | null>(null, [Validators.required]),
        'snd_kid_stg_order': this.snd_kid_stg_order = new FormControl<number | null>(null, []),
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
      if (this.selected_Sanad_kid_stage!.snd_kid_stg_seq!!= null)
        this.snd_kid_stg_seq.setValue(this.selected_Sanad_kid_stage!.snd_kid_stg_seq);

        if (this.selected_Sanad_kid_stage!.snd_kid_stg_name! != null)
        this.snd_kid_stg_name.setValue(this.selected_Sanad_kid_stage!.snd_kid_stg_name);

        if (this.selected_Sanad_kid_stage!.snd_kid_stg_order! != null)
        this.snd_kid_stg_order.setValue(this.selected_Sanad_kid_stage!.snd_kid_stg_order);

        if ( this.selected_Sanad_kid_stage!.sanad_kid_stage_users!= null)
        for (let i=0; i< this.selected_Sanad_kid_stage!.sanad_kid_stage_users.length; i++){
          if (this.selected_Sanad_kid_stage!.sanad_kid_stage_users[i]!= null )
          this.users_list.forEach((user, index) =>{
            if (this.selected_Sanad_kid_stage!.sanad_kid_stage_users!= null && this.selected_Sanad_kid_stage!.sanad_kid_stage_users[i]!= null )
              if (user.user_seq== this.selected_Sanad_kid_stage.sanad_kid_stage_users[i].user_fk)
              this.users.controls[index].setValue(true);
            });  
        }
    }
  }

  getValue()
  {
    if (this.Form!= null )
    {
      
        if (this.snd_kid_stg_name.value!= null)
          this.selected_Sanad_kid_stage.snd_kid_stg_name = this.snd_kid_stg_name.value;


          if (this.snd_kid_stg_order.value!= null)
          this.selected_Sanad_kid_stage.snd_kid_stg_order = this.snd_kid_stg_order.value;

          console.log('this.users.controls', this.users.controls);
          for (let i=0; i< this.users_list.length; i++){
            console.log('i', i);
            console.log('this.users.controls[i].value', this.users.controls[i].value);
            if (this.users.controls[i].value!= null)
              if (this.users.controls[i].value == true){
                this.selected_Sanad_kid_stage.sanad_kid_stage_users= [];
                this.selected_Sanad_kid_stage.sanad_kid_stage_users?.push({user_fk: this.users_list[i].user_seq, user: this.users_list[i]});
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

    if (this.selected_Sanad_kid_stage.snd_kid_stg_seq!!= null)
    {
      this.sanadKidStageService.update(this.selected_Sanad_kid_stage).subscribe(
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
    }else if (this.selected_Sanad_kid_stage.snd_kid_stg_seq== null)
    {
      console.log('this.selected_Exchange_order_stage', this.selected_Sanad_kid_stage);
      this.sanadKidStageService.add(this.selected_Sanad_kid_stage).subscribe(
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
    this.snd_kid_stg_name.addAsyncValidators([validateSndKidStgName(this.sanadKidStageService, this.snd_kid_stg_name.value)]);

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
