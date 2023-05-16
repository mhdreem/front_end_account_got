import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanadKidListSearchComponent } from './sanad-kid-list-search.component';

describe('SanadKidListSearchComponent', () => {
  let component: SanadKidListSearchComponent;
  let fixture: ComponentFixture<SanadKidListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanadKidListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanadKidListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
