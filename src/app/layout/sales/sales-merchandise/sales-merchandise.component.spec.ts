import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMerchandiseComponent } from './sales-merchandise.component';

describe('SalesMerchandiseComponent', () => {
  let component: SalesMerchandiseComponent;
  let fixture: ComponentFixture<SalesMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
