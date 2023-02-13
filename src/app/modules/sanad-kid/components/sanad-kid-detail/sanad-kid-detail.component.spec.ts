import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanadKidDetailComponent } from './sanad-kid-detail.component';

describe('SanadKidDetailComponent', () => {
  let component: SanadKidDetailComponent;
  let fixture: ComponentFixture<SanadKidDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanadKidDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanadKidDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
