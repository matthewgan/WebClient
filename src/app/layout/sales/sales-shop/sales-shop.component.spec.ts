import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesShopComponent } from './sales-shop.component';

describe('SalesShopComponent', () => {
  let component: SalesShopComponent;
  let fixture: ComponentFixture<SalesShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
