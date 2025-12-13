import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalapagosPage } from './galapagos.page';

describe('GalapagosPage', () => {
  let component: GalapagosPage;
  let fixture: ComponentFixture<GalapagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GalapagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
