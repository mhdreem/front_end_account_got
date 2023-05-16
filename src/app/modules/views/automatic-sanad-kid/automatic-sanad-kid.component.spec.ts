import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticSanadKidComponent } from './automatic-sanad-kid.component';

describe('AutomaticSanadKidComponent', () => {
  let component: AutomaticSanadKidComponent;
  let fixture: ComponentFixture<AutomaticSanadKidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticSanadKidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomaticSanadKidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
