import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { subscribeOn, Subscription } from 'rxjs';
import {user} from '../../models/user'
import {UserService} from '../../services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  _Subscription:Subscription = new Subscription();

  Form!: FormGroup;
  username!: FormControl<string | null>;
  password!: FormControl<string | null>;


  isLoadingResults = false;

  LoginResultState: string = '';

  hide = true;
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
     public UserService: UserService,
    private fb: FormBuilder) {
    this.BuildForm();
  }

  ngOnInit(): void {

  }

  public BuildForm() {
    this.Form = this.fb.group(
      {
        'username': this.username = new FormControl<string | null>(null, [Validators.required]),
        'password': this.password = new FormControl<string | null>(null, [Validators.required]),
      }
    )
  }

  Login() {

    let user: user = {};
    user.user_name= this.username.value!;
    user.user_password = this.password.value! ;
    this.isLoadingResults = true;
    this._Subscription.add(
      this.UserService.login(user)
      .subscribe((res: any) => {
        this.isLoadingResults = false;
        if (res === 'Error') {
          this.LoginResultState = 'اسم المستحدم أو كلمة السر خاطئة ';
        } else if (res. token != null && res.User!= null) {

          this.UserService.Login_User = res.User;
          this.UserService.Login_User_BehavourSubject.next(res.User);

          localStorage.setItem('token', res.token);
          localStorage.setItem('User', res.User);

        //  this.shamelPrivilige.List_User_Windows('00100');
          this.router.navigate(['']);
        }

        return;
      }, (err) => {

        this.LoginResultState = 'حدث خطأ اثناء تسجيل الدخول ';
        console.log(err);
        this.isLoadingResults = false;
      })

    );
    
  }


}
