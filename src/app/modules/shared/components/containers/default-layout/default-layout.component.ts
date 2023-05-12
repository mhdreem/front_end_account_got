import { AfterViewInit, Component, Input, OnInit , HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { BreadcrumbRouterService } from '@coreui/angular/lib/breadcrumb/breadcrumb-router/breadcrumb-router.service';
import { IconSetService } from '@coreui/icons-angular';
// import { TBLShamelUser } from '../../../models/employees_department/TBLShamelUser';
// import { TBLShamelUserService } from '../../../services/employees_department/tblshamel-user.service';
import { ReturnBtnService } from '../../../services/return-btn.service';
// import { ThemeService } from '../../../services/theme.service';
import { NavService } from './nav.service';
import { cilPencil, cilMenu } from '@coreui/icons';
import { NavbarService } from '../../../services/navbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']

})
export class DefaultLayoutComponent implements OnInit, AfterViewInit {
  @HostListener('document:mousemove', ['$event'])
    mousemove(event: any) {
      if (event.clientX > 95/100*window. innerWidth){
        document.querySelector('c-sidebar')?.classList.remove('hide');
      }
      if (event.clientX > 80/100*window. innerWidth && this.navbarService.isHeaderAnchClicked == true){
        document.querySelector('c-sidebar')?.classList.remove('hide');
        this.navbarService.onNavbarVisit();
      }
      if (event.clientX < 80/100*window. innerWidth && this.navbarService.isHeaderAnchClicked == false){
        document.querySelector('c-sidebar')?.classList.remove('headerAnchorClicked');
        document.querySelector('c-sidebar')?.classList.add('hide');
      }
    }

  _navItems: INavData[];
  

  public set navItems(arr : INavData[])
  {
    this._navItems = arr;

    

    /*
    let items2Remove : INavData[] = [];
    if (this._navItems!= null &&
        this._navItems.length >0 &&
        this.SelectedUser!= null &&
        this.SelectedUser.TBLShamelPrivilages!= null &&
        this.SelectedUser.TBLShamelPrivilages.length >0)
    {

        this._navItems.forEach(element => {

          var Result = false;
 
          if (element!= null && element.formname!=null && element.formname.length>0)
          {
            var Privilages = this.SelectedUser.TBLShamelPrivilages.filter(
              x=>x.formname == element.formname
            );

            if (Privilages!= null && Privilages.length>0)
            {             
              Privilages.forEach(element => {
                if (element.privilage!= null && element.privilage.length==5)
                {
                  if (element.privilage[2] == '1')
                  {
                    Result = true;                  
                  }                  
                }
              });
          
            }

            

            
          }

          if (!Result )
               items2Remove.push(element);
               
        });

       
       


    }
        items2Remove.forEach(element => {
      var index = this._navItems.indexOf(element);
      if (index>=0)
      this._navItems =this._navItems.slice(index ,1);
    });
*/

    
  }

  public get navItems():INavData[]
  {
    return this._navItems;
  }


  // _SelectedUser:TBLShamelUser;
  // @Input('SelectedUser') set SelectedUser(obj:TBLShamelUser){
  //     this._SelectedUser = obj;
  // }
  // get SelectedUser():TBLShamelUser{return this._SelectedUser}



  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  // darkTheme: boolean;
  constructor(
    private navService:NavService,
    // private userService :TBLShamelUserService,
    private returnBtnService: ReturnBtnService,
    private router: Router,
    public iconSet: IconSetService,
    public navbarService: NavbarService
    ) {
      iconSet.icons = {cilPencil, cilMenu};
      // this.load_User();
    this.navService.navItems_Subject.subscribe(
      data=>
      {
        this.navItems = data;
      }
    )
  }

  ngOnInit(): void {
    // this.load_User();

   
  }

  ngAfterViewInit(){
    
  }

  // load_User()
  // {
  //   if (this.userService.Login_User != null &&
  //     this.userService.Login_User.user_id!= null &&
  //     this.userService.Login_User.user_id>=0)
  //     {
  //       this.SelectedUser = this.userService .Login_User;
  //       return;
  //     }

    
  //       var token = localStorage.getItem('token');
  //       var User =  localStorage.getItem('User') as TBLShamelUser;  
  //       if (User!= null &&
  //           User.user_id!= null &&
  //           User.user_id>0)
  //       {
  //         this.userService .Login_User = User;
  //         this.userService .Login_User_BehavourSubject.next(User);
  //         this.SelectedUser = this.userService .Login_User;
  //       }        
      
  // }

  onReturnClick(){
    this.navService.navItems_Subject.next(this.returnBtnService.navItems);
    this.router.navigate([this.returnBtnService.returnUrl]);
  }
}
