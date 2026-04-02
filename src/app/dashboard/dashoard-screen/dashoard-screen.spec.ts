import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashoardScreen } from './dashoard-screen';

describe('DashoardScreen', () => {
  let component: DashoardScreen;
  let fixture: ComponentFixture<DashoardScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashoardScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(DashoardScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
