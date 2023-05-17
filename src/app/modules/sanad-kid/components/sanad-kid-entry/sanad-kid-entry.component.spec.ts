import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeOrderEntryComponent } from './exchange-order-entry.component';

describe('ExchangeOrderEntryComponent', () => {
  let component: ExchangeOrderEntryComponent;
  let fixture: ComponentFixture<ExchangeOrderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeOrderEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
