import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostaPage } from './costa.page';

describe('CostaPage', () => {
  let component: CostaPage;
  let fixture: ComponentFixture<CostaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CostaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
