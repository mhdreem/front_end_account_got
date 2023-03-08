import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-columns',
  templateUrl: './select-columns.component.html',
  styleUrls: ['./select-columns.component.scss']
})
export class SelectColumnsComponent {
  @Input() all_columns_names: string[] = [];
  @Output() updateColumnsEvent = new EventEmitter<number[]>();

  checkBoxValues: number[]= [];

  constructor(){
    for (let i=0; i< this.all_columns_names.length; i++)
      this.checkBoxValues[i]= 0;
  }
  
  onColumnSelect(){
    this.updateColumnsEvent.emit(this.checkBoxValues);
  }
}
