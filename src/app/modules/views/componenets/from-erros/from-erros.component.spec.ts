import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromErrosComponent } from './from-erros.component';

describe('FromErrosComponent', () => {
  let component: FromErrosComponent;
  let fixture: ComponentFixture<FromErrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FromErrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromErrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
