import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptOrderListSearchComponent } from './receipt-order-list-search.component';

describe('ReceiptOrderListSearchComponent', () => {
  let component: ReceiptOrderListSearchComponent;
  let fixture: ComponentFixture<ReceiptOrderListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptOrderListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptOrderListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
