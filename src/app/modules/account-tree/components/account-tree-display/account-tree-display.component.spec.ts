import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTreeDisplayComponent } from './account-tree-display.component';

describe('AccountTreeDisplayComponent', () => {
  let component: AccountTreeDisplayComponent;
  let fixture: ComponentFixture<AccountTreeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTreeDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTreeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
