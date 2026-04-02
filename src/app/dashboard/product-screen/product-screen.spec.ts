import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductScreen } from './product-screen';

describe('ProductScreen', () => {
  let component: ProductScreen;
  let fixture: ComponentFixture<ProductScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
