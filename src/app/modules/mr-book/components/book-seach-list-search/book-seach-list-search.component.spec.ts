import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSeachListSearchComponent } from './book-seach-list-search.component';

describe('BookSeachListSearchComponent', () => {
  let component: BookSeachListSearchComponent;
  let fixture: ComponentFixture<BookSeachListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookSeachListSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSeachListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
