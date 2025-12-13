import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SierraPage } from './sierra.page';

describe('SierraPage', () => {
  let component: SierraPage;
  let fixture: ComponentFixture<SierraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SierraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
