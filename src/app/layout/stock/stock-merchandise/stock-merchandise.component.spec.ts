import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMerchandiseComponent } from './stock-merchandise.component';

describe('StockMerchandiseComponent', () => {
  let component: StockMerchandiseComponent;
  let fixture: ComponentFixture<StockMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
