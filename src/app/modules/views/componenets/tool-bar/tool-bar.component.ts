import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnChanges {
  
  @Input() ToolBarTemplate: TemplateRef<any>;
  @Output() OnCommandExecute:   EventEmitter<any> = new   EventEmitter<any>(); 
  
  
  constructor() { 
  
  }
 
  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['ToolBarTemplate']!= null)
    {
      this.ToolBarTemplate = changes['ToolBarTemplate'].currentValue;
    }
 }

    

}