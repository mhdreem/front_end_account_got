import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeOrderListSearchComponent } from './exchange-order-list-search.component';

describe('ExchangeOrderListSearchComponent', () => {
  let component: ExchangeOrderListSearchComponent;
  let fixture: ComponentFixture<ExchangeOrderListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeOrderListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeOrderListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
