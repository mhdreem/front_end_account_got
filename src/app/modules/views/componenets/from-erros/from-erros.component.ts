import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-from-erros',
  templateUrl: './from-erros.component.html',
  styleUrls: ['./from-erros.component.scss']
})
export class FromErrosComponent implements OnInit,OnChanges {
  @Input() Form:FormGroup ;
  @Input() list_error:string[]=[] ;
  @Input() list_error_message:string[]=[] ;
  formErrors:string[]=[] ;
  
  constructor(
    ) {
       // Get the selected language from Service 
     }

  ngOnChanges(changes: SimpleChanges): void {
   

    if (
    changes['Form']!= null 
  )
  {
    this.Form = changes['Form'].currentValue;
    if (this.Form!= null)
    this.Form.valueChanges.subscribe(
      value => {
        this.logValidationErrors()
      }
    );
  }
}

  logValidationErrors() {
    
  }

  

  ngOnInit(): void {
  }

}
