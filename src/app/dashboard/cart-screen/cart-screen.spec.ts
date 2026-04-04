import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartScreen } from './cart-screen';

describe('CartScreen', () => {
  let component: CartScreen;
  let fixture: ComponentFixture<CartScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(CartScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
