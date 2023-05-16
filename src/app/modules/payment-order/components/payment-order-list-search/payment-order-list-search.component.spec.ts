import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOrderListSearchComponent } from './payment-order-list-search.component';

describe('PaymentOrderListSearchComponent', () => {
  let component: PaymentOrderListSearchComponent;
  let fixture: ComponentFixture<PaymentOrderListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentOrderListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentOrderListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
