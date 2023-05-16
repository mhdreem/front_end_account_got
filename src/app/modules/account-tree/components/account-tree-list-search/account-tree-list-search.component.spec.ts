import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTreeListSearchComponent } from './account-tree-list-search.component';

describe('AccountTreeListSearchComponent', () => {
  let component: AccountTreeListSearchComponent;
  let fixture: ComponentFixture<AccountTreeListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTreeListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTreeListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
