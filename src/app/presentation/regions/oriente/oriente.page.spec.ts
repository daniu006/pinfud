import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrientePage } from './oriente.page';

describe('OrientePage', () => {
  let component: OrientePage;
  let fixture: ComponentFixture<OrientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
